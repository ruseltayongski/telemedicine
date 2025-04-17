import React, { useState, useEffect, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import AgoraRTC from 'agora-rtc-sdk-ng';

import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';

const AgoraVideoCall = ({ channelName, appId, token, uid, remoteUserName = "User", patient_id, doctor_id, recipient, booking_id }) => {
    // State variables
    const [isJoined, setIsJoined] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState({
        audioTrack: null,
        videoTrack: null
    });

    const [muted, setMuted] = useState(false);
    const [videoDisabled, setVideoDisabled] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    
    // Refs
    const clientRef = useRef(null);
    const timerRef = useRef(null);
    const containerRef = useRef(null);
    
    // Initialize on component mount
    useEffect(() => {
        // Create and initialize the client
        clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        
        // Setup event listeners
        const handleUserPublished = async (user, mediaType) => {
            await clientRef.current.subscribe(user, mediaType);
            
            // Update remote users when a new user publishes
            if (mediaType === 'video') {
                setRemoteUsers(prevUsers => {
                    // Remove the user if they're already in the list to avoid duplicates
                    const filteredUsers = prevUsers.filter(u => u.uid !== user.uid);
                    return [...filteredUsers, user];
                });
            }
            
            // Play audio automatically
            if (mediaType === 'audio' && user.audioTrack) {
                user.audioTrack.play();
            }
        };
        
        const handleUserUnpublished = (user, mediaType) => {
            // Remove user from remote users when they unpublish video
            if (mediaType === 'video') {
                setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
            }
        };
        
        const handleUserLeft = (user) => {
            // Remove user from remote users when they leave
            setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
        };
        
        // Register event listeners
        clientRef.current.on('user-published', handleUserPublished);
        clientRef.current.on('user-unpublished', handleUserUnpublished);
        clientRef.current.on('user-left', handleUserLeft);
        
        // Join the channel when appId and channelName are available
        const joinChannel = async () => {
            if (!appId || !channelName) return;
            
            try {
                // Join the channel
                await clientRef.current.join(appId, channelName, token || null, uid || null);
                
                // Create and publish local tracks
                const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                const videoTrack = await AgoraRTC.createCameraVideoTrack();
                
                setLocalTracks({
                    audioTrack,
                    videoTrack
                });

                // Publish local tracks
                await clientRef.current.publish([audioTrack, videoTrack]);
                
                setIsJoined(true);
                // Start call duration timer
                startCallTimer();                             
            } catch (error) {
                console.error('Error joining channel:', error);
            }
        };
        
        joinChannel();
        
        // Apply full screen styles
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        if (containerRef.current) {
            //requestFullScreen(containerRef.current);
        }
        
        // Cleanup function
        return () => {
            // Close local tracks
            if (localTracks.audioTrack) {
                localTracks.audioTrack.close();
            }
            if (localTracks.videoTrack) {
                localTracks.videoTrack.close();
            }
            
            // Leave the channel
            if (clientRef.current) {
                clientRef.current.leave();
                
                // Remove event listeners
                clientRef.current.off('user-published', handleUserPublished);
                clientRef.current.off('user-unpublished', handleUserUnpublished);
                clientRef.current.off('user-left', handleUserLeft);
            }
            
            // Clear timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            
            // Restore body styles
            document.body.style.overflow = '';
            document.body.style.margin = '';
            document.body.style.padding = '';
            
            // Exit fullscreen if active
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }, [appId, channelName, token, uid]);
    
    // Request full screen mode
    const requestFullScreen = (element) => {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
            element.msRequestFullscreen();
        }
    };
    
    // Start call timer
    const startCallTimer = () => {
        timerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
    };
    
    // Format call duration
    const formatCallDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    // Toggle mute function
    const toggleMute = async () => {
        if (localTracks.audioTrack) {
            await localTracks.audioTrack.setMuted(!muted);
            setMuted(!muted);
        }
    };
    
    // Toggle video function
    const toggleVideo = async () => {
        if (localTracks.videoTrack) {
            await localTracks.videoTrack.setMuted(!videoDisabled);
            setVideoDisabled(!videoDisabled);
        }
    };
    
    // Leave call function
    const leaveCall = async () => {
        // Close local tracks
        if (localTracks.audioTrack) {
            localTracks.audioTrack.close();
        }
        if (localTracks.videoTrack) {
            localTracks.videoTrack.close();
        }
        
        // Leave the channel
        if (clientRef.current) {
            await clientRef.current.leave();
        }
        
        // Clear timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        // Reset state
        setIsJoined(false);
        setRemoteUsers([]);
        setLocalTracks({
            audioTrack: null,
            videoTrack: null
        });
        setCallDuration(0);
        
        // Exit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        window.close();
    };

    const [prescription, setPrescription] = useState("<p><strong>Rx:</strong></p><ul><li>Paracetamol 500mg - Take 1 tablet every 6 hours as needed</li></ul>");
    const [prescriptionNo, setPrescriptionNo] = useState('');
    const [isOpenPrescription, setIsOpenPrescription] = useState(false);
    const openModalPrescription = () => setIsOpenPrescription(true);
    const closeModalPrescription = () => setIsOpenPrescription(false);
    const savePrescription = () => {
        router.post(route('prescriptions.store'), {
            content: prescription,
            prescription_no: prescriptionNo,
            doctor_id: doctor_id,
            patient_id: patient_id,
            booking_id: booking_id,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setPrescription('<p><strong>Rx:</strong></p><ul><li>Paracetamol 500mg - Take 1 tablet every 6 hours as needed</li></ul>');
                Swal.fire({
                    icon: 'success',
                    title: 'Created!',
                    text: 'Prescription saved successfully!',
                    timer: 2000,
                    showConfirmButton: false,
                });
                closeModalPrescription(); 
            },
        });
    };
    
    const generatePrescription = () => {
        const url = route('prescriptions.pdf', {
            patient_id: patient_id,
            doctor_id: doctor_id,
            booking_id: booking_id,
        });
    
        window.open(url, '_blank');
    };

    useEffect(() => {
        if (isOpenPrescription) {
            const year = new Date().getFullYear();
            const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
            const generatedNo = `RX-${year}-${random}`;
            setPrescriptionNo(generatedNo);
        }
    }, [isOpenPrescription]);

    return (
        <>
            <div 
                ref={containerRef}
                className="signal-video-call-container" 
                style={{ 
                    height: '100vh', 
                    width: '100vw', 
                    overflow: 'hidden', 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0,
                    backgroundColor: '#f5f5f5'
                }}
            >
                {/* Main remote video view - truly full screen */}
                <div className="remote-video-view position-absolute" 
                    style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#f5f5f5'
                    }}
                >
                    {remoteUsers.length > 0 && remoteUsers[0].videoTrack ? (
                        <div className="h-100 w-100" ref={(ref) => {
                            if (ref) {
                                remoteUsers[0].videoTrack.play(ref);
                            }
                        }}></div>
                    ) : (
                        <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                            <div className="text-center">
                                <div className="bg-secondary rounded-circle mx-auto mb-3" style={{ width: '100px', height: '100px' }}>
                                    <span className="text-white fs-1 d-flex justify-content-center align-items-center h-100">
                                        {remoteUserName.charAt(0)}
                                    </span>
                                </div>
                                <p className="text-dark fs-4">Waiting for {remoteUserName} to join...</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Header info */}
                    <div className="call-header position-absolute top-0 start-0 w-100 text-center py-3" 
                        style={{ 
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white'
                        }}>
                        <h5 className="mb-1">{remoteUserName}</h5>
                        <p className="mb-0">Signal {formatCallDuration(callDuration)}</p>
                    </div>
                    
                    {/* Local video PiP */}
                    <div className="local-video-pip position-absolute"
                        style={{ 
                            bottom: '100px', 
                            right: '20px', 
                            width: '120px', 
                            height: '160px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#000',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            zIndex: 10
                        }}>
                        {isJoined && localTracks.videoTrack && !videoDisabled ? (
                            <div className="h-100 w-100" ref={(ref) => {
                                if (ref) {
                                    localTracks.videoTrack.play(ref);
                                }
                            }}></div>
                        ) : (
                            <div className="h-100 w-100 d-flex justify-content-center align-items-center bg-secondary">
                                <span className="text-white fs-4">You</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Call controls */}
                    <div className="call-controls position-absolute bottom-0 start-0 w-100 d-flex justify-content-center pb-5" style={{ zIndex: 20 }}>
                        <div className="d-flex gap-4">
                            <button 
                                onClick={toggleVideo} 
                                className={`btn btn-lg rounded-circle shadow`}
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    backgroundColor: videoDisabled ? '#e0e0e0' : '#ffffff'
                                }}
                            >
                                {videoDisabled ? (
                                    <svg fill="#000000" width="64px" height="64px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" ></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="m1421.141 2.417 91.775 64.262L215.481 1918.962l.595.416-.378.54-92.37-64.678L246.074 1680H0V240h1254.726L1421.141 2.416Zm79.395 278.487V678.89L1920 346.052v1228.01l-419.464-332.951V1680H520.538l76.895-109.78 793.325.001v-556.235l177.995 141.29 241.468 191.548V573.176l-241.468 191.662-177.995 141.29-.001-468.498 109.779-156.726Zm-322.705 68.874H109.779v1220.443h213.19l854.862-1220.443Z" ></path> </g></svg>
                                ) : (
                                    <svg fill="#000000" width="64px" height="64px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" ></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M0 240v1440h1500.536v-438.89L1920 1574.062V346.051L1500.536 678.89V240H0Zm109.779 109.779h1280.979v556.348l177.995-141.29 241.468-191.66v773.646l-241.468-191.549-177.995-141.29v556.236H109.778V349.78Z" ></path> </g></svg>
                                )}
                            </button>

                            <button 
                                onClick={toggleMute} 
                                className={`btn btn-lg rounded-circle shadow`}
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    backgroundColor: muted ? '#e0e0e0' : '#ffffff'
                                }}
                            >
                                {muted ? (
                                    <svg fill="#000000" width="64px" height="64px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" ></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M621.452 435.678c0-186.858 152.004-338.862 338.862-338.862 159.316 0 293.306 110.504 329.336 258.896L724.351 1162.76c-63.433-61.62-102.899-147.78-102.899-242.994V435.678Zm46.834 807.122c-88.168-79.79-143.65-195.06-143.65-323.033V435.679C524.636 195.475 720.111 0 960.315 0c176.955 0 329.645 106.09 397.775 257.997L1538.8 0l92.38 64.669L333.381 1917.48 241 1852.81l305.287-435.84C414.414 1301.53 331 1132.02 331 943.411V709.984h96.818v233.427c0 155.809 67.319 296.239 174.392 393.719l66.076-94.33Zm292.028 15.83c-9.387 0-18.687-.39-27.883-1.14l-62.071 88.62c29.036 6.12 59.127 9.34 89.955 9.34 240.205 0 435.675-195.48 435.675-435.683V595.685l-96.81 138.223v185.858c0 186.854-152.01 338.864-338.866 338.864Zm-162.996 191.75-57.715 82.4c54.294 20.4 112.13 33.5 172.305 38.1v252.3H669.861V1920h580.909v-96.82h-242.044v-252.3c324.464-24.8 580.904-296.76 580.904-627.469V709.984h-96.82v233.427c0 293.549-238.94 532.499-532.495 532.499-56.824 0-111.602-8.96-162.997-25.53Z" ></path> </g></svg>
                                ) : (
                                    <svg fill="#000000" width="64px" height="64px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M960.315 96.818c-186.858 0-338.862 152.003-338.862 338.861v484.088c0 186.858 152.004 338.862 338.862 338.862 186.858 0 338.861-152.004 338.861-338.862V435.68c0-186.858-152.003-338.861-338.861-338.861M427.818 709.983V943.41c0 293.551 238.946 532.497 532.497 532.497 293.55 0 532.496-238.946 532.496-532.497V709.983h96.818V943.41c0 330.707-256.438 602.668-580.9 627.471l-.006 252.301h242.044V1920H669.862v-96.818h242.043l-.004-252.3C587.438 1546.077 331 1274.116 331 943.41V709.983h96.818ZM960.315 0c240.204 0 435.679 195.475 435.679 435.68v484.087c0 240.205-195.475 435.68-435.68 435.68-240.204 0-435.679-195.475-435.679-435.68V435.68C524.635 195.475 720.11 0 960.315 0Z"></path> </g></svg>
                                )}
                            </button>
                            
                            <button 
                                onClick={leaveCall}
                                className="btn btn-lg rounded-circle shadow"
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    backgroundColor: '#E53935',
                                    color: 'white'
                                }}
                            >
                                <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" ></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M14.3308 15.9402L15.6608 14.6101C15.8655 14.403 16.1092 14.2384 16.3778 14.1262C16.6465 14.014 16.9347 13.9563 17.2258 13.9563C17.517 13.9563 17.8052 14.014 18.0739 14.1262C18.3425 14.2384 18.5862 14.403 18.7908 14.6101L20.3508 16.1702C20.5579 16.3748 20.7224 16.6183 20.8346 16.887C20.9468 17.1556 21.0046 17.444 21.0046 17.7351C21.0046 18.0263 20.9468 18.3146 20.8346 18.5833C20.7224 18.8519 20.5579 19.0954 20.3508 19.3L19.6408 20.02C19.1516 20.514 18.5189 20.841 17.8329 20.9541C17.1469 21.0672 16.4427 20.9609 15.8208 20.6501C10.4691 17.8952 6.11008 13.5396 3.35083 8.19019C3.03976 7.56761 2.93414 6.86242 3.04914 6.17603C3.16414 5.48963 3.49384 4.85731 3.99085 4.37012L4.70081 3.65015C5.11674 3.23673 5.67937 3.00464 6.26581 3.00464C6.85225 3.00464 7.41488 3.23673 7.83081 3.65015L9.40082 5.22021C9.81424 5.63615 10.0463 6.19871 10.0463 6.78516C10.0463 7.3716 9.81424 7.93416 9.40082 8.3501L8.0708 9.68018C8.95021 10.8697 9.91617 11.9926 10.9608 13.04C11.9994 14.0804 13.116 15.04 14.3008 15.9102L14.3308 15.9402Z" stroke="#ffffff"></path> </g></svg>
                            </button>

                            <button 
                                onClick={() => {
                                    if (recipient === 'doctor') {
                                        openModalPrescription();  // Doctor action
                                    } else if (recipient === 'patient') {
                                        generatePrescription();  // Patient action
                                    }
                                }}
                                className="btn btn-lg rounded-circle shadow"
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    backgroundColor: '#4CAF50', // Green color for medical action
                                    color: 'white'
                                }}
                            >
                                <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5v14M5 12h14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                <div className={`modal fade ${isOpenPrescription ? "show d-block" : ""}`} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create Prescription</h5>
                                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="prescriptionNo" className="form-label">Prescription #</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="prescriptionNo"
                                        value={prescriptionNo}
                                        readOnly
                                    />
                                </div>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data="<ul><li>Paracetamol 500mg - Take 1 tablet every 6 hours as needed</li></ul>"
                                    config={{
                                        toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setPrescription(data);
                                    }}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModalPrescription}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={savePrescription}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isOpenPrescription && <div className="modal-backdrop fade show"></div>}
            </div>
        </>
        
    );
};

export default AgoraVideoCall;

// import React, { useRef, useEffect, useState } from 'react';
// import { FaceDetection } from '@mediapipe/face_detection';
// import { Camera } from '@mediapipe/camera_utils';

// const PersonCounter = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [personCount, setPersonCount] = useState(0);
//   const faceDetectionRef = useRef(null);

//   useEffect(() => {
//     const onResults = (results) => {
//       // Update the person count based on detected faces
//       setPersonCount(results.detections.length);

//       // Draw detections to canvas (optional)
//       const canvasElement = canvasRef.current;
//       const canvasCtx = canvasElement.getContext('2d');
//       canvasCtx.save();
//       canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//       canvasCtx.drawImage(
//         results.image, 0, 0, canvasElement.width, canvasElement.height
//       );

//       if (results.detections.length > 0) {
//         results.detections.forEach(detection => {
//           const box = detection.boundingBox;
//           canvasCtx.strokeStyle = '#00FF00';
//           canvasCtx.lineWidth = 2;
//           canvasCtx.strokeRect(
//             box.xMin * canvasElement.width,
//             box.yMin * canvasElement.height,
//             (box.xMax - box.xMin) * canvasElement.width,
//             (box.yMax - box.yMin) * canvasElement.height
//           );
//         });
//       }
//       canvasCtx.restore();
//     };

//     // Initialize face detection
//     faceDetectionRef.current = new FaceDetection({
//       locateFile: (file) => {
//         return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
//       }
//     });

//     faceDetectionRef.current.setOptions({
//       model: 'short', // or 'full' for more accurate but slower detection
//       minDetectionConfidence: 0.5
//     });

//     faceDetectionRef.current.onResults(onResults);

//     // Initialize camera
//     if (videoRef.current) {
//       const camera = new Camera(videoRef.current, {
//         onFrame: async () => {
//           if (videoRef.current) {
//             await faceDetectionRef.current.send({ image: videoRef.current });
//           }
//         },
//         width: 640,
//         height: 480
//       });
//       camera.start();
//     }

//     return () => {
//       if (faceDetectionRef.current) {
//         faceDetectionRef.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div style={{ position: 'relative', width: '640px', height: '480px' }}>
//       <video 
//         ref={videoRef} 
//         style={{ position: 'absolute', width: '100%', height: '100%' }}
//         playsInline
//       />
//       <canvas 
//         ref={canvasRef} 
//         style={{ position: 'absolute', width: '100%', height: '100%' }}
//         width={640}
//         height={480}
//       />
//       <div style={{
//         position: 'absolute',
//         top: '10px',
//         left: '10px',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         color: 'white',
//         padding: '10px',
//         borderRadius: '5px',
//         fontSize: '24px'
//       }}>
//         People: {personCount}
//       </div>
//     </div>
//   );
// };

// export default PersonCounter;

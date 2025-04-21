import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onChildAdded, off } from 'firebase/database';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyB7Epl_VSU8H1sN8rH9J-kENGtdOIDfsYM",
    authDomain: "telemedicinethesis-27316.firebaseapp.com",
    databaseURL: "https://telemedicinethesis-27316-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "telemedicinethesis-27316",
    storageBucket: "telemedicinethesis-27316.firebasestorage.app",
    messagingSenderId: "554743062964",
    appId: "1:554743062964:web:244a2183f8a4c3af2b12e1",
    measurementId: "G-H24X2N4E9E"
};
  
  // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const AgoraVideoCall = ({ channelName, appId, token, uid, patient_id, doctor_id, recipient, booking_id, caller_name, exist_prescription, booking_code }) => {
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

    // Chat related state
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const chatContainerRef = useRef(null);

    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const messageInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Draggable position state
    // const [position, setPosition] = useState({ x: 20, y: 100 });
    const [position, setPosition] = useState({
        x: window.innerWidth - 370,
        bottom: 100 
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    // Refs
    const clientRef = useRef(null);
    const timerRef = useRef(null);
    const containerRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const chatPanelRef = useRef(null);

    // Initialize on component mount
    let currentUserId = null;
    if(recipient === 'doctor') {
        currentUserId = doctor_id;
    } else if(recipient === 'patient') {
        currentUserId = patient_id;
    }

    useEffect(() => {
        const chatRef = ref(database, `chats/${channelName}`);
        
        const handleNewMessage = (snapshot) => {
          const newMessage = snapshot.val();
          setMessages(prev => [...prev, {
            id: snapshot.key,
            senderId: newMessage.senderId,
            text: newMessage.text,
            timestamp: newMessage.timestamp,
            isMe: newMessage.senderId === currentUserId,
            file: newMessage.file
          }]);
          
          // Scroll to bottom when new message arrives
          setTimeout(() => {
            scrollToLatestMessage();
          }, 100);
        };
        
        onChildAdded(chatRef, handleNewMessage);
        
        // Cleanup Firebase listener
        return () => {
          off(chatRef, 'child_added', handleNewMessage);
        };
    }, [channelName, currentUserId, database]);

    useEffect(() => {
        if (isChatOpen) {
          scrollToLatestMessage();
          if (messageInputRef.current) {
            messageInputRef.current.focus();
          }
        }
    }, [isChatOpen]);

    const scrollToLatestMessage = () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            //console.log(chatPanelRef.current.offsetHeight);
            if (isDragging && chatPanelRef.current) {
                // Calculate new left position
                const newX = e.clientX - dragOffset.x;
                const viewportWidth = window.innerWidth;
                const panelWidth = chatPanelRef.current.offsetWidth;
    
                const boundedX = Math.max(10, Math.min(newX, viewportWidth - panelWidth - 10));
    
                // Calculate bottom instead of top
                const viewportHeight = window.innerHeight;
                const panelHeight = chatPanelRef.current.offsetHeight;
                const panelBottom = viewportHeight - (e.clientY + (panelHeight - dragOffset.y));
                // const boundedBottom = Math.max(10, Math.min(panelBottom, viewportHeight - 10));
                const boundedBottom = Math.max(10, Math.min(panelBottom, 250));
                setPosition({ x: boundedX, bottom: boundedBottom });
            }
        };
    
        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                document.body.style.userSelect = 'auto';
            }
        };
    
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
        }
    
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    // Start dragging
    const handleMouseDown = (e) => {
        // Only start drag on the header element
        if (e.target.closest('.chat-header')) {
            const rect = chatPanelRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setIsDragging(true);
            e.preventDefault();
        }
    };

    const sendMessage = async () => {
        if(!message.trim()) {
            showToast('Please write a message');
            return;
        }
        if (!message.trim() && !file) return;
        
        try {
          setIsUploading(true);
          
          const formData = new FormData();
          formData.append('booking_code', booking_code);
          formData.append('sender_id', currentUserId);
          formData.append('receiver_id', currentUserId === doctor_id ? patient_id : doctor_id);
          formData.append('message', message);
          
          if (file) {
            formData.append('file', file);
          }
          
          // First upload to Laravel
          const response = await axios.post('/chats', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // Then push to Firebase
          const messagesRef = ref(database, `chats/${channelName}`);
          await push(messagesRef, {
            senderId: currentUserId,
            text: message,
            timestamp: Date.now(),
            channelName: channelName,
            file: file ? {
              name: response.data.file_name,
              type: response.data.file_type,
              path: response.data.file_path,
              size: response.data.file_size,
              id: response.data.id
            } : null
          });
          
          setMessage('');
          setFile(null);
          setPreviewUrl(null);
        } catch (error) {
          console.error('Error sending message:', error);
          // Use more subtle notification instead of full screen alert
          showToast('Failed to send message');
        } finally {
          setIsUploading(false);
        }
    };

    const showToast = (message) => {
        // Simple toast notification implementation
        const toast = document.createElement('div');
        toast.className = 'chat-toast-ai';
        toast.innerHTML = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
          }, 3000);
        }, 100);
    };
      
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleTextChange = (e) => {
        setMessage(e.target.value);
        
        // Simulate typing indicator
        if (e.target.value.length > 0) {
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
        } else {
          setIsTyping(false);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    };
    
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        
        // File size validation - 10MB max
        if (selectedFile.size > 10 * 1024 * 1024) {
          showToast('File size exceeds 10MB limit');
          return;
        }
        
        setFile(selectedFile);
        
        // Create preview for images
        if (selectedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => setPreviewUrl(reader.result);
          reader.readAsDataURL(selectedFile);
        }
        messageInputRef.current.focus();
    };

    const removeFile = () => {
        setFile(null);
        setPreviewUrl(null);
    };
    
    // Render message content with improved styling
    const renderMessageContent = (msg) => {
        if (msg.file) {
        return (
            <div className="file-message">
            {msg.file.type.startsWith('image/') ? (
                <div className="image-preview mb-2">
                <img 
                    src={`/storage/${msg.file.path}`} 
                    alt={msg.file.name} 
                    className="rounded img-fluid"
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                    onClick={() => window.open(`/storage/${msg.file.path}`, '_blank')}
                />
                </div>
            ) : (
                <div className="file-info d-flex align-items-center p-2 bg-light rounded">
                    <div className="file-icon me-2">
                        {getFileIcon(msg.file.type)}
                    </div>
                    <div className="file-details flex-grow-1">
                        <div className="file-name text-truncate text-muted" style={{ maxWidth: '150px' }}>
                            {msg.file.name}
                        </div>
                        <div className="file-size small text-muted">
                            {formatFileSize(msg.file.size)}
                        </div>
                    </div>
                    <a
                        href={route('chats.download', { id: msg.file.id })}
                        className="btn btn-sm btn-primary ms-2 download-btn"
                        download
                    >
                        ↓
                    </a>
                </div>
            )}
            {msg.text && <div className="text-message mt-2">{msg.text}</div>}
            </div>
        );
        }
        return <div className="msg-text">{msg.text}</div>;
    };

    // Helper functions
    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word')) return '📝';
        if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
        if (fileType.includes('image')) return '🖼️';
        return '📁';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };    
    
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
        
        //joinChannel();
        
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
        
        };
    }, [appId, channelName, token, uid]);
      
    // Start call timer
    const alertShownRef = useRef(false);
    const startCallTimer = () => {
        timerRef.current = setInterval(() => {
            setCallDuration(prev => {
                const updatedDuration = prev + 1;
                if (updatedDuration === 60 && !alertShownRef.current) {
                    alertShownRef.current = true;
                    Swal.fire({
                        title: '1 Hour Mark Approaching!',
                        text: '15 minutes remaining until you reach 1 hour in your video call.',
                        icon: 'info',
                        confirmButtonText: 'OK'
                    });                    
                }
                return updatedDuration;
            });
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
        
        window.close();
    };

    const [prescription, setPrescription] = useState("<ul><li>Paracetamol 500mg - Take 1 tablet every 6 hours as needed</li></ul>");
    const [prescriptionNo, setPrescriptionNo] = useState('');
    const [isOpenPrescription, setIsOpenPrescription] = useState(false);
    const openModalPrescription = () => setIsOpenPrescription(true);
    const closeModalPrescription = () => setIsOpenPrescription(false);
    const savePrescription = async () => {
        try {
            await axios.post(route('prescriptions.store'), {
                content: prescription,
                prescription_no: prescriptionNo,
                doctor_id: doctor_id,
                patient_id: patient_id,
                booking_id: booking_id,
            });
    
            setPrescription('<ul><li>Paracetamol 500mg - Take 1 tablet every 6 hours as needed</li></ul>');
            
            Swal.fire({
                icon: 'success',
                title: 'Created!',
                text: 'Prescription saved successfully!',
                timer: 2000,
                showConfirmButton: false,
            });
    
            closeModalPrescription();
        } catch (error) {
            Swal.fire('Error!', 'Failed to save prescription.', 'error');
            closeModalPrescription();
        }
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

    // lab requesr variable
    const [isOpenLabRequest, setIsOpenLabRequest] = useState(false);
    const [selectedTests, setSelectedTests] = useState([]);
    const [doctorNotes, setDoctorNotes] = useState('');
    const [requestedDate, setRequestedDate] = useState(new Date().toISOString().split('T')[0]);
    const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
    const [labTests, setLabTests] = useState([]);

    // Add these functions near your other functions
    const openModalLabRequest = () => setIsOpenLabRequest(true);
    const closeModalLabRequest = () => {
        setIsOpenLabRequest(false);
        setSelectedTests([]);
        setDoctorNotes('');
    };

    const fetchLabTests = async () => {
        try {
            const response = await axios.get('/lab-tests');
            setLabTests(response.data);
        } catch (error) {
            console.error('Error fetching lab tests:', error);
            showToast('Failed to load lab tests');
        }
    };

    useEffect(() => {
        if (isOpenLabRequest) {
            fetchLabTests();
        }
    }, [isOpenLabRequest]);

    const toggleTestSelection = (testId) => {
        setSelectedTests(prev => 
            prev.includes(testId) 
            ? prev.filter(id => id !== testId) 
            : [...prev, testId]
        );
    };

    const submitLabRequest = async () => {
        if (selectedTests.length === 0) {
            showToast('Please select at least one lab test');
            return;
        }
        if(!doctorNotes) {
            showToast('Please provide doctor notes');
            return;
        }

        try {
            const lab_request_data = {
                doctor_id: doctor_id,
                patient_id: patient_id,
                booking_id: booking_id,
                requested_date: requestedDate,
                scheduled_date: scheduledDate,
                doctor_notes: doctorNotes,
                lab_tests: selectedTests
            };
            console.log(lab_request_data);
            const response = await axios.post('/lab-requests-create', lab_request_data);
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Lab request submitted successfully',
                timer: 2000,
                showConfirmButton: false,
            });

            closeModalLabRequest();
        } catch (error) {
            console.error('Error submitting lab request:', error);
            Swal.fire('Error!', 'Failed to submit lab request', 'error');
        }
    };


    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [showAiPanel, setShowAiPanel] = useState(false);
    const editorRef = useRef(null);

    const generateWithAI = async () => {
        if (!aiPrompt.trim()) {
          showToast('Please enter some symptoms or conditions');
          return;
        }
      
        setIsGenerating(true);
        
        try {
          const response = await axios.post('/ai/prescription', {
            prompt: `As a medical professional, generate a prescription for a patient with these symptoms/conditions: ${aiPrompt}. 
            Include appropriate medications, dosages, and instructions. Format as HTML with proper list structure.`
          });
      
          if (response.data && response.data.content) {
            setPrescription(response.data.content);
            if (editorRef.current) {
                editorRef.current.setData(response.data.content);
            }
            setShowAiPanel(false);
          }
        } catch (error) {
          console.error('AI generation error:', error);
          showToast('Failed to generate prescription');
        } finally {
          setIsGenerating(false);
        }
      };
      
      const refineWithAI = async () => {
        if (!prescription.trim()) {
          showToast('Please write a prescription first');
          return;
        }
      
        setIsGenerating(true);
        
        try {
          const response = await axios.post('/api/ai/prescription', {
            prompt: `Review and improve this medical prescription: ${prescription}. 
            Ensure proper formatting, check for medication interactions, and suggest any improvements.
            Return the enhanced prescription in HTML format.`
          });
      
          if (response.data && response.data.content) {
            setPrescription(response.data.content);
          }
        } catch (error) {
          console.error('AI refinement error:', error);
          showToast('Failed to refine prescription');
        } finally {
          setIsGenerating(false);
        }
    };

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
                                        {caller_name.charAt(0)}
                                    </span>
                                </div>
                                <p className="text-dark fs-4">Waiting for {caller_name} to join...</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Header info */}
                    <div className="call-header position-absolute top-0 start-0 w-100 text-center py-3" 
                        style={{ 
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white'
                        }}>
                        <h5
                            className="mb-1"
                            style={{
                                color: remoteUsers.length > 0 && remoteUsers[0].videoTrack ? '#1DB954' : '#006838',
                            }}
                        >
                            {caller_name}
                        </h5>
                        <p className="mb-0">Duration: {formatCallDuration(callDuration)}</p>
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
                                onClick={toggleChat}
                                className="btn btn-lg rounded-circle shadow"
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    backgroundColor: '#2196F3',
                                    color: 'white'
                                }}
                            >
                                {/* 💬 */}
                                <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 16V8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M8 14V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M16 14V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                            </button>

                            {/* Chat panel */}
                            <div 
                                ref={chatPanelRef}
                                className={`chat-panel position-absolute ${isChatOpen ? 'chat-open' : 'chat-closed'}`}
                                style={{
                                    bottom: isChatOpen ? `${position.bottom}px` : '-400px',
                                    // right: '20px',
                                    left: position.x,
                                    width: '350px',
                                    height: '600px',
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    zIndex: 1000,
                                    opacity: isChatOpen ? 1 : 0,
                                    pointerEvents: isChatOpen ? 'all' : 'none'
                                }}
                                onMouseDown={handleMouseDown}
                            >
                                {/* Chat header - handle for dragging */}
                                <div 
                                    className="chat-header p-3 d-flex justify-content-between align-items-center border-bottom"
                                    style={{ 
                                        cursor: isDragging ? 'grabbing' : 'grab',
                                        borderTopLeftRadius: '12px',
                                        borderTopRightRadius: '12px',
                                        backgroundColor: '#f0f4f8',
                                        position: 'relative'
                                    }}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="drag-handle-icon me-2">
                                        <div className="drag-dots">
                                            <span></span><span></span>
                                            <span></span><span></span>
                                            <span></span><span></span>
                                        </div>
                                        </div>
                                        <h6 className="mb-0 fw-bold">Chat</h6>
                                    </div>
                                    <button 
                                        onClick={toggleChat} 
                                        className="btn btn-sm btn-light rounded-circle"
                                        style={{ width: '30px', height: '30px', lineHeight: '10px' }}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                {/* Messages container */}
                                <div 
                                ref={chatContainerRef}
                                className="chat-messages flex-grow-1 p-3 overflow-auto"
                                style={{ 
                                    scrollBehavior: 'smooth',
                                    backgroundColor: '#f8f9fa'
                                }}
                                >
                                {messages.length === 0 && (
                                    <div className="text-center text-muted my-5">
                                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>👋</div>
                                    <p>No messages yet</p>
                                    <p className="small">Start the conversation!</p>
                                    </div>
                                )}
                                
                                {messages.map((msg, index) => (
                                    <div 
                                    key={msg.id} 
                                    className={`mb-3 ${msg.isMe ? 'text-end' : 'text-start'}`}
                                    >
                                    <div 
                                        className={`d-inline-block p-3 rounded-3 message-bubble ${
                                        msg.isMe ? 'bg-primary text-white' : 'bg-white border'
                                        }`}
                                        style={{ 
                                        maxWidth: '85%',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        position: 'relative',
                                        marginTop: 
                                            index > 0 && messages[index-1].senderId === msg.senderId ? '5px' : '15px'
                                        }}
                                    >
                                        {renderMessageContent(msg)}
                                        <div 
                                            className={`small ${msg.isMe ? 'text-light' : 'text-muted'} mt-2`}
                                            style={{ opacity: 0.8 }}
                                        >
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit', 
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    </div>
                                ))}
                                
                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="typing-indicator d-flex align-items-center mb-3">
                                    <div className="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <span className="small text-muted ms-2">Typing...</span>
                                    </div>
                                )}
                                </div>
                                
                                {/* Input area */}
                                <div className="chat-input p-3 border-top bg-white">
                                {/* Image preview */}
                                {previewUrl && (
                                    <div className="image-preview-container mb-2 position-relative">
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        style={{ 
                                        maxWidth: '100%', 
                                        maxHeight: '150px', 
                                        borderRadius: '8px',
                                        objectFit: 'cover' 
                                        }}
                                    />
                                    <button 
                                        onClick={removeFile}
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                        style={{ 
                                        borderRadius: '50%', 
                                        width: '28px', 
                                        height: '28px', 
                                        padding: '0',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                    </div>
                                )}
                                
                                {/* File preview */}
                                {file && !previewUrl && (
                                    <div className="file-preview mb-2 p-2 bg-light rounded d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 file-icon-lg">{getFileIcon(file.type)}</span>
                                        <div>
                                        <div className="text-truncate" style={{ maxWidth: '200px' }}>{file.name}</div>
                                        <small className="text-muted">{formatFileSize(file.size)}</small>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={removeFile}
                                        className="btn btn-sm btn-danger rounded-circle"
                                        style={{ width: '28px', height: '28px', padding: '0px' }}
                                    >
                                        ×
                                    </button>
                                    </div>
                                )}
                                
                                {/* Message input and buttons */}
                                <div className="d-flex gap-2">
                                    <div className="input-group flex-nowrap">
                                    <textarea
                                        ref={messageInputRef}
                                        className="form-control rounded-pill-start"
                                        rows="1"
                                        value={message}
                                        onChange={handleTextChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        style={{ 
                                        resize: 'none',
                                        borderRadius: '20px 0 0 20px',
                                        paddingRight: '40px'
                                        }}
                                    />
                                    
                                    <label 
                                        className="input-group-text bg-white border-start-0" 
                                        htmlFor="file-upload"
                                        style={{ 
                                        cursor: 'pointer',
                                        borderRadius: '0',
                                        padding: '0 15px'
                                        }}
                                    >
                                        📎
                                        <input
                                        id="file-upload"
                                        type="file"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                        />
                                    </label>
                                    
                                    <button 
                                        className="btn btn-primary send-btn"
                                        onClick={sendMessage}
                                        disabled={isUploading || (!message.trim() && !file)}
                                        style={{ 
                                        borderRadius: '0 20px 20px 0',
                                        transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {isUploading ? '...' : '➤'}
                                    </button>
                                    </div>
                                </div>
                                </div>
                            </div>

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
                                {recipient === 'doctor' ? (
                                    <svg fill="#ffffff" width="64px" height="64px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M183.31348,188l22.34326-22.34326a7.99984,7.99984,0,0,0-11.31348-11.31348L172,176.68652l-41.71289-41.71277A52.0008,52.0008,0,0,0,120,32H72a8.00008,8.00008,0,0,0-8,8V192a8,8,0,0,0,16,0V136h28.68652l52,52-22.34326,22.34326a7.99984,7.99984,0,1,0,11.31348,11.31348L172,199.31348l22.34326,22.34326a7.99984,7.99984,0,0,0,11.31348-11.31348ZM80,120V48h40a36,36,0,0,1,0,72Z"></path> </g></svg>
                                ) : (
                                    <svg fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xmlSpace="preserve" width="64px" height="64px" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="prescription_1_" d="M28,31.36H4c-0.199,0-0.36-0.161-0.36-0.36V1c0-0.199,0.161-0.36,0.36-0.36h18 c0.096,0,0.188,0.038,0.255,0.105l6,6C28.322,6.813,28.36,6.904,28.36,7v24C28.36,31.199,28.199,31.36,28,31.36z M4.36,30.64h23.28 V7.36H22c-0.199,0-0.36-0.161-0.36-0.36V1.36H4.36V30.64z M22.36,6.64h4.771L22.36,1.869V6.64z M20,27.36H8v-0.72h12V27.36z M24,23.36H8v-0.72h16V23.36z M24,19.36H8v-0.72h16V19.36z M16.254,9.254l-0.509-0.509L13,11.491l-2.252-2.252 C11.684,8.925,12.36,8.04,12.36,7c0-1.301-1.059-2.36-2.36-2.36H7.64V13h0.72V9.36h1.491l2.64,2.64l-2.746,2.746l0.509,0.509 L13,12.509l2.746,2.746l0.509-0.509L13.509,12L16.254,9.254z M8.36,8.64V5.36H10c0.904,0,1.64,0.736,1.64,1.64S10.904,8.64,10,8.64 H8.36z"></path> </g></svg>
                                )}
                            </button>

                            <button 
                                onClick={openModalLabRequest}
                                className="btn btn-lg rounded-circle shadow"
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    backgroundColor: '#2196F3', // Blue color for lab action
                                    color: 'white'
                                }}
                            >
                                <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 10H15M12 7V13M9.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V7.8C19 6.11984 19 5.27976 18.673 4.63803C18.3854 4.07354 17.9265 3.6146 17.362 3.32698C16.7202 3 15.8802 3 14.2 3H9.8C8.11984 3 7.27976 3 6.63803 3.32698C6.07354 3.6146 5.6146 4.07354 5.32698 4.63803C5 5.27976 5 6.11984 5 7.8V16.2C5 17.8802 5 18.7202 5.32698 19.362C5.6146 19.9265 6.07354 20.3854 6.63803 20.673C7.27976 21 8.11984 21 9.8 21Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
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
                                <button type="button" className="btn-close" onClick={closeModalPrescription}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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

                                {/* AI Panel Toggle */}
                                <div className="mb-3">
                                    <button 
                                        onClick={() => setShowAiPanel(!showAiPanel)}
                                        className="btn btn-sm btn-outline-primary"
                                        type="button"
                                    >
                                        {showAiPanel ? 'Hide AI Assistant' : 'Get AI Help'}
                                    </button>
                                </div>

                                {/* AI Assistant Panel */}
                                {showAiPanel && (
                                    <div className="ai-panel mb-3 p-3 border rounded">
                                        <h6>AI Prescription Assistant</h6>
                                        <div className="mb-2">
                                        <label className="form-label">Describe symptoms/conditions:</label>
                                        <textarea
                                            className="form-control mb-2"
                                            rows="3"
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                            placeholder="E.g., 'Patient has high fever, cough, and sore throat...'"
                                        />
                                        <button 
                                            onClick={generateWithAI}
                                            className="btn btn-primary me-2"
                                            disabled={isGenerating}
                                        >
                                            {isGenerating ? 'Generating...' : 'Generate Prescription'}
                                        </button>
                                        <button 
                                            onClick={refineWithAI}
                                            className="btn btn-outline-primary"
                                            disabled={isGenerating || !prescription.trim()}
                                        >
                                            {isGenerating ? 'Refining...' : 'Refine Current'}
                                        </button>
                                        </div>
                                        <div className="small text-muted">
                                        AI suggestions are for assistance only. Always review carefully.
                                        </div>
                                    </div>
                                )}

                                <CKEditor
                                    editor={ClassicEditor}
                                    data={(exist_prescription && exist_prescription.content) || "<ul><li>Paracetamol 500mg - Take 1 tablet every 6 hours as needed</li></ul>"}
                                    config={{
                                        toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
                                    }}
                                    onReady={(editor) => {
                                        editorRef.current = editor;
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

            <div className="container mt-5">
                <div className={`modal fade ${isOpenLabRequest ? "show d-block" : ""}`} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h5 className="modal-title">Create Laboratory Request</h5>
                            <button type="button" className="btn-close" onClick={closeModalLabRequest}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="mb-3">
                                    <label htmlFor="requestedDate" className="form-label">Requested Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="requestedDate"
                                        value={requestedDate}
                                        onChange={(e) => setRequestedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="scheduledDate" className="form-label">Scheduled Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="scheduledDate"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Select Lab Tests</label>
                                    <div className="row">
                                    {labTests.map(test => (
                                        <div key={test.id} className="col-md-6 mb-2">
                                            <div 
                                                className={`card ${selectedTests.includes(test.id) ? 'border-primary' : ''}`}
                                                onClick={() => toggleTestSelection(test.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="card-body">
                                                <div className="form-check">
                                                    <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={selectedTests.includes(test.id)}
                                                    onChange={() => {}}
                                                    />
                                                    <label className="form-check-label">
                                                    <strong>{test.name}</strong> ({test.code})
                                                    </label>
                                                </div>
                                                <p className="small mb-1">{test.description}</p>
                                                <div className="d-flex justify-content-between small text-muted">
                                                    <span>Category: {test.category}</span>
                                                    <span>Sample: {test.sample_type}</span>
                                                </div>
                                                {test.requires_fasting != 0 && (
                                                    <div className="badge bg-warning text-dark mt-1">
                                                    Requires Fasting
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="doctorNotes" className="form-label">Doctor's Notes</label>
                                    <textarea
                                        className="form-control"
                                        id="doctorNotes"
                                        rows="3"
                                        value={doctorNotes}
                                        onChange={(e) => setDoctorNotes(e.target.value)}
                                        placeholder="Any special instructions for the lab..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeModalLabRequest}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={submitLabRequest}>
                                Submit Request
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isOpenLabRequest && <div className="modal-backdrop fade show"></div>}
            </div>

        </>
    
    );
};

export default AgoraVideoCall;

// export default AgoraVideoCall;

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

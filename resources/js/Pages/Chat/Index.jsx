import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { database } from '@/firebase';
import { 
    ref, 
    push, 
    set, 
    onValue, 
    query, 
    orderByChild, 
    serverTimestamp,
    update
} from 'firebase/database';
import GuestLayout from '@/Layouts/GuestLayout';
import axios from 'axios';

export default function Chat({ auth, users, currentUser }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const messagesEndRef = useRef(null);

    // Add these state variables inside your component
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [unreadMessages, setUnreadMessages] = useState({});
    const currentChatRef = useRef(null);

    // Add this useEffect to request notification permission
    useEffect(() => {
      // Request notification permission
      if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
      
      // Set up listener for notifications across all chats
      const setupNotificationListeners = () => {
        // Get all possible chat rooms where this user is involved
        users.forEach(otherUser => {
          const roomId = getChatRoomId(currentUser.id, otherUser.id);
          const messagesRef = ref(database, `chats/${roomId}/messages`);
          
          // Use the 'child_added' event to only get new messages
          onValue(messagesRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const msg = childSnapshot.val();
              const messageId = childSnapshot.key;
              // Only notify for new messages from other users
              // if (msg.receiverId === currentUser.id && 
              //     msg.senderId !== currentUser.id && 
              //     (!msg.notified) && 
              //     currentChatRef.current !== msg.senderId) {
              if (msg.receiverId === currentUser.id && 
                  msg.senderId !== currentUser.id && 
                  (!msg.notified)) {
                
                  console.log(msg);
                  // Create notification
                  showNotification(otherUser.name, msg.text, messageId, roomId);
                  
                  // Update message to mark as notified
                  // You could add a field in your database to track this if needed
                  
              }
            });
          });
        });
      };
      
      setupNotificationListeners();
      
      // Clean up listeners on unmount
      return () => {
        users.forEach(otherUser => {
          const roomId = getChatRoomId(currentUser.id, otherUser.id);
          const messagesRef = ref(database, `chats/${roomId}/messages`);
          off(messagesRef);
        });
      };
    }, [currentUser, users]);

    // Update this when a user is selected
    useEffect(() => {
      if (selectedUser) {
        currentChatRef.current = selectedUser.id;
      } else {
        currentChatRef.current = null;
      }
    }, [selectedUser]);

    // Add this function to show notifications
    const showNotification = async (senderName, messageText, messageId, roomId) => {
        // Update the message to mark it as notified
        const messageRef = ref(database, `chats/${roomId}/messages/${messageId}`);
                    
        // Use update to only change the notified field without replacing other data
        await update(messageRef, {
          notified: true
        });
      // if (notificationPermission === 'granted' && document.visibilityState !== 'visible') {
      //   console.log('hahahahahahaasdasdsa');
      //   const notification = new Notification(`New message from ${senderName}`, {
      //     body: messageText,
      //     icon: '/favicon.ico' // Use your app icon here
      //   });
        
      //   // Handle notification click - open the chat with this user
      //   notification.onclick = () => {
      //     window.focus();
      //     // Find and select the sender user
      //     const sender = users.find(user => user.name === senderName);
      //     if (sender) {
      //       selectUser(sender);
      //     }
      //   };
      // }
    };

    // Generate a unique chat room ID between two users
    const getChatRoomId = (user1Id, user2Id) => {
        return [user1Id, user2Id].sort().join('_');
    };

    useEffect(() => {
        // Set up listener for online status changes
        const userStatusRef = ref(database, 'status');
        const unsubscribeStatus = onValue(userStatusRef, (snapshot) => {
            if (snapshot.exists()) {
                setOnlineUsers(snapshot.val());
            }
        });
        
        // Set the current user as online in Firebase
        const userStatusDbRef = ref(database, `status/${currentUser.id}`);
        set(userStatusDbRef, {
            online: true,
            lastActive: serverTimestamp()
        });
        
        // Update user status in Laravel database
        axios.post('/update-status', { status: true });
        
        // Set online status to false when user leaves
        const handleBeforeUnload = () => {
            const offlineStatusRef = ref(database, `status/${currentUser.id}`);
            set(offlineStatusRef, {
                online: false,
                lastActive: serverTimestamp()
            });
            
            // Try to update Laravel DB too, though this might not work reliably on page close
            navigator.sendBeacon('/update-status', JSON.stringify({ status: false }));
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            unsubscribeStatus();
        };
    }, [currentUser]);
    
    useEffect(() => {
        if (!selectedUser) return;
        
        const roomId = getChatRoomId(currentUser.id, selectedUser.id);
        const messagesRef = ref(database, `chats/${roomId}/messages`);
        const messagesQuery = query(messagesRef, orderByChild('timestamp'));
        
        const unsubscribe = onValue(messagesQuery, (snapshot) => {
            const fetchedMessages = [];
            snapshot.forEach((childSnapshot) => {
                fetchedMessages.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            setMessages(fetchedMessages);
        });
        
        return () => {
            unsubscribe();
        };
    }, [selectedUser, currentUser]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser) return;
        
        const roomId = getChatRoomId(currentUser.id, selectedUser.id);
        const messagesRef = ref(database, `chats/${roomId}/messages`);
        const newMessageRef = push(messagesRef);
        
        set(newMessageRef, {
            text: message,
            senderId: currentUser.id,
            senderName: currentUser.name,
            receiverId: selectedUser.id,
            timestamp: serverTimestamp(),
            read: false,
            notified: false
        });
        
        setMessage('');
    };
    
    const selectUser = (user) => {
        setSelectedUser(user);
        setMessages([]);
    };
    
    // Function to determine if a user is online
    const isUserOnline = (userId) => {
        return onlineUsers[userId]?.online === true;
    };

    return (
       <GuestLayout>
        <Head title="Book Appointment" />
        <div className="chat-container d-flex">
          {/* User list sidebar */}
          <div className="user-list border-end p-3" style={{ width: '250px' }}>
            {users.map(user => (
              <div 
                key={user.id} 
                className={`p-3 border-bottom user-item ${selectedUser?.id === user.id ? 'bg-light' : ''}`}
                onClick={() => selectUser(user)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="rounded-circle" width="40" height="40" />
                    ) : (
                      <div className="avatar-placeholder rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="fw-bold">{user.name}</div>
                    <small className={isUserOnline(user.id) ? 'text-success' : 'text-muted'}>
                      {isUserOnline(user.id) ? 'Online' : 'Offline'}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
      
          {/* Chat area */}
          <div className="chat-area flex-grow-1 p-3">
            {selectedUser ? (
              <>
                <div className="mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Chat with {selectedUser.name}</h5>
                  <small className={isUserOnline(selectedUser.id) ? 'text-success' : 'text-muted'}>
                    {isUserOnline(selectedUser.id) ? 'Online' : 'Offline'}
                  </small>
                </div>
      
                <div className="messages mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {messages.map(msg => (
                    <div key={msg.id} className={`message mb-2 ${msg.senderId === currentUser.id ? 'text-end' : ''}`}>
                      <div className={`d-inline-block p-2 rounded-3 ${msg.senderId === currentUser.id ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '75%' }}>
                        {msg.text}
                        <div className="small mt-1" >
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                          {msg.senderId === currentUser.id && (
                            <>
                              {' '}
                              {msg.read ? (
                                <span className="ms-2 text-success">✓✓</span>
                              ) : (
                                <span className="ms-2">✓</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
      
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                </div>
              </>
            ) : (
              <div className="text-center text-muted mt-5">Select a user to start chatting</div>
            )}
          </div>
        </div>
      </GuestLayout>
    );
}
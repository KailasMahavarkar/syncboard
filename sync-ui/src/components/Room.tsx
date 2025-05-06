import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket'; // Adjust the path as needed
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  edited?: boolean;
  edit_timestamp?: number;
}

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { socket } = useSocket();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (!socket || !roomId) {
      navigate('/');
      return;
    }
    
    // Set current user
    setCurrentUser(socket.id);
    
    // Listen for socket events
    socket.on('message', (data: Message) => {
      setMessages(prev => [...prev, data]);
    });
    
    socket.on('message_sent', (data: Message) => {
      setMessages(prev => [...prev, data]);
    });
    
    socket.on('message_history', (data: { messages: Message[] }) => {
      setMessages(data.messages);
    });
    
    socket.on('message_edited', (data: { id: string, content: string, edited: boolean, edit_timestamp: number }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.id 
            ? { ...msg, content: data.content, edited: true, edit_timestamp: data.edit_timestamp } 
            : msg
        )
      );
    });
    
    socket.on('message_deleted', (data: { id: string }) => {
      setMessages(prev => prev.filter(msg => msg.id !== data.id));
    });
    
    socket.on('user_joined', (data: { user: string }) => {
      setUsers(prev => [...prev, data.user]);
      // Add system message
      const systemMsg: Message = {
        id: `system-${Date.now()}`,
        sender: 'system',
        content: `User ${data.user.substring(0, 8)} joined the room`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, systemMsg]);
    });
    
    socket.on('user_left', (data: { user: string }) => {
      setUsers(prev => prev.filter(user => user !== data.user));
      // Add system message
      const systemMsg: Message = {
        id: `system-${Date.now()}`,
        sender: 'system',
        content: `User ${data.user.substring(0, 8)} left the room`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, systemMsg]);
    });
    
    // Clean up on component unmount
    return () => {
      socket.off('message');
      socket.off('message_sent');
      socket.off('message_history');
      socket.off('message_edited');
      socket.off('message_deleted');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [socket, roomId, navigate]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;
    
    socket.emit('message', inputMessage);
    setInputMessage('');
  };
  
  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('leave_room');
      navigate('/');
    }
  };
  
  const handleEditMessage = (id: string, newContent: string) => {
    if (socket) {
      socket.emit('edit_message', { id, content: newContent });
    }
  };
  
  const handleDeleteMessage = (id: string) => {
    if (socket) {
      socket.emit('delete_message', { id });
    }
  };
  
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="border-b p-4 flex justify-between items-center bg-gray-800 text-white">
        <div>
          <h1 className="text-xl font-bold">Room: {roomId}</h1>
          <p className="text-sm text-gray-300">Connected users: {users.length}</p>
        </div>
        <button 
          onClick={handleLeaveRoom}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Leave Room
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              isOwnMessage={msg.sender === currentUser}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!inputMessage.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Room; 
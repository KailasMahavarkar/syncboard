import React, { useState } from 'react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  edited?: boolean;
  edit_timestamp?: number;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  onEdit: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Check if the message is a system message (you can add this property to system messages)
  const isSystem = message.sender === 'system';
  
  // Handle edit submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent);
    }
    setIsEditing(false);
  };
  
  return (
    <div className={`mb-4 ${isSystem ? 'flex justify-center' : ''}`}>
      {isSystem ? (
        <div className="text-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {message.content}
        </div>
      ) : (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[70%] ${isOwnMessage ? 'bg-green-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
            {!isEditing ? (
              <>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{isOwnMessage ? 'You' : message.sender.substring(0, 8)}</span>
                  <span className="text-xs opacity-75 ml-2">{formattedTime}</span>
                </div>
                
                <div className="mt-1">
                  {message.content}
                </div>
                
                {message.edited && (
                  <div className="text-xs italic mt-1 opacity-75">
                    (edited)
                  </div>
                )}
                
                {isOwnMessage && (
                  <div className="flex gap-2 mt-2 text-xs">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="underline opacity-75 hover:opacity-100"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(message.id)}
                      className="underline opacity-75 hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-1 border rounded text-black"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(message.content);
                    }}
                    className="px-2 py-1 text-xs bg-gray-300 text-black rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 
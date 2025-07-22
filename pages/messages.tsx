import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { User, Message } from '../types'

interface Conversation {
  id: number
  user: User
  lastMessage: Message
  unreadCount: number
  messages: Message[]
}

export default function Messages() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  // Mock conversations data
  const mockConversations: Conversation[] = [
    {
      id: 1,
      user: {
        id: 2,
        email: 'mary.johnson@email.com',
        name: 'Mary Johnson',
        type: 'seller',
        userId: 'SEL001',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25683ef?w=100&h=100&fit=crop&crop=face'
      },
      lastMessage: {
        id: 3,
        senderId: 2,
        receiverId: 1,
        content: 'Thank you for your interest in the kente cloth! It\'s handwoven by local artisans.',
        read: false,
        createdAt: '2024-07-22T14:30:00Z'
      },
      unreadCount: 1,
      messages: [
        {
          id: 1,
          senderId: 1,
          receiverId: 2,
          content: 'Hi! I\'m interested in the Traditional Kente Cloth. Can you tell me more about it?',
          read: true,
          createdAt: '2024-07-22T14:00:00Z'
        },
        {
          id: 2,
          senderId: 2,
          receiverId: 1,
          content: 'Hello! I\'d be happy to help. What would you like to know specifically?',
          read: true,
          createdAt: '2024-07-22T14:15:00Z'
        },
        {
          id: 3,
          senderId: 2,
          receiverId: 1,
          content: 'Thank you for your interest in the kente cloth! It\'s handwoven by local artisans.',
          read: false,
          createdAt: '2024-07-22T14:30:00Z'
        }
      ]
    },
    {
      id: 2,
      user: {
        id: 3,
        email: 'grace.davis@email.com',
        name: 'Grace Davis',
        type: 'seller',
        userId: 'SEL002',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      lastMessage: {
        id: 5,
        senderId: 1,
        receiverId: 3,
        content: 'Perfect! When can I expect delivery?',
        read: true,
        createdAt: '2024-07-21T16:45:00Z'
      },
      unreadCount: 0,
      messages: [
        {
          id: 4,
          senderId: 3,
          receiverId: 1,
          content: 'Hi! Your order for the wooden elephant sculpture is ready for shipping.',
          read: true,
          createdAt: '2024-07-21T16:30:00Z'
        },
        {
          id: 5,
          senderId: 1,
          receiverId: 3,
          content: 'Perfect! When can I expect delivery?',
          read: true,
          createdAt: '2024-07-21T16:45:00Z'
        }
      ]
    }
  ]

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setCurrentUser(parsedUser)
    setConversations(mockConversations)
    setLoading(false)
  }, [router])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return

    setSending(true)

    // Create new message
    const message: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: selectedConversation.user.id,
      content: newMessage.trim(),
      read: false,
      createdAt: new Date().toISOString()
    }

    // Update conversation
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: message
    }

    // Update conversations list
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedConversation : conv
    ))
    setSelectedConversation(updatedConversation)
    setNewMessage('')

    // Simulate sending delay
    setTimeout(() => {
      setSending(false)
    }, 500)
  }

  const markAsRead = (conversation: Conversation) => {
    if (conversation.unreadCount > 0) {
      const updatedConversation = { ...conversation, unreadCount: 0 }
      setConversations(conversations.map(conv => 
        conv.id === conversation.id ? updatedConversation : conv
      ))
      if (selectedConversation?.id === conversation.id) {
        setSelectedConversation(updatedConversation)
      }
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInHours / 24

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!currentUser) {
    return null // Will redirect to login
  }

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <Layout>
      <Head>
        <title>Messages - LibMarketplace</title>
        <meta name="description" content="Manage your messages on LibMarketplace" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              💬 Messages
              {totalUnread > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {totalUnread}
                </span>
              )}
            </h1>
            <p className="text-gray-600">Chat with sellers and buyers</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
            <div className="flex h-full">
              {/* Conversations List */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Conversations</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-4">💬</div>
                      <p className="text-gray-600">No conversations yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Start a conversation by messaging a seller about their products
                      </p>
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation)
                          markAsRead(conversation)
                        }}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          selectedConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-liberian-blue' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={conversation.user.avatar}
                              alt={conversation.user.name}
                              className="w-12 h-12 rounded-full"
                            />
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">
                                {conversation.user.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedConversation.user.avatar}
                          alt={selectedConversation.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {selectedConversation.user.name}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {selectedConversation.user.type} • {selectedConversation.user.verified ? '✓ Verified' : 'Unverified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === currentUser.id
                                ? 'bg-liberian-blue text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 input-field"
                          disabled={sending}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || sending}
                          className="btn-primary disabled:opacity-50"
                        >
                          {sending ? (
                            <LoadingSpinner size="sm" color="white" />
                          ) : (
                            '📤'
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* No conversation selected */
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-600">
                        Choose a conversation from the left to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">💡 Messaging Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h4 className="font-medium mb-2">For Buyers:</h4>
                <ul className="space-y-1">
                  <li>• Ask sellers about product details</li>
                  <li>• Negotiate prices respectfully</li>
                  <li>• Confirm shipping arrangements</li>
                  <li>• Report any suspicious activity</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">For Sellers:</h4>
                <ul className="space-y-1">
                  <li>• Respond to inquiries promptly</li>
                  <li>• Provide accurate product information</li>
                  <li>• Be professional and courteous</li>
                  <li>• Update buyers on order status</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
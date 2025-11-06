import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function LiveChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickReplies = [
    'Cách đặt vé',
    'Chính sách hủy vé',
    'Thời gian hoàn tiền',
    'Liên hệ hotline',
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputMessage.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      let botResponse = '';
      const lowerText = messageText.toLowerCase();

      if (lowerText.includes('đặt vé') || lowerText.includes('cách đặt')) {
        botResponse =
          'Để đặt vé, bạn chỉ cần: 1) Chọn điểm đi và điểm đến 2) Chọn ngày và số hành khách 3) Chọn chuyến xe phù hợp 4) Chọn ghế và điền thông tin 5) Thanh toán. Rất đơn giản!';
      } else if (lowerText.includes('hủy') || lowerText.includes('hoàn')) {
        botResponse =
          'Bạn có thể hủy vé trước 24 giờ khởi hành để được hoàn 90% giá vé. Trước 12 giờ: hoàn 70%. Trước 2 giờ: hoàn 50%. Để hủy vé, vui lòng truy cập trang Quản lý đơn hàng.';
      } else if (lowerText.includes('hotline') || lowerText.includes('liên hệ')) {
        botResponse =
          'Hotline hỗ trợ 24/7: 1900 6467. Email: support@vexeviet.com. Chúng tôi luôn sẵn sàng hỗ trợ bạn!';
      } else if (lowerText.includes('thanh toán') || lowerText.includes('payment')) {
        botResponse =
          'Chúng tôi hỗ trợ nhiều phương thức thanh toán: Ví MoMo, chuyển khoản ngân hàng, thẻ tín dụng/ghi nợ, và tiền mặt khi lên xe.';
      } else {
        botResponse =
          'Cảm ơn câu hỏi của bạn! Bạn có thể liên hệ hotline 1900 6467 để được hỗ trợ chi tiết hơn, hoặc chọn một trong các câu hỏi thường gặp bên dưới.';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-shadow"
          >
            <MessageCircle className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="flex flex-col h-[600px] max-h-[calc(100vh-3rem)] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white">Hỗ trợ trực tuyến</h3>
                    <p className="text-xs text-white/80">Luôn sẵn sàng hỗ trợ bạn</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`
                        max-w-[75%] px-4 py-2 rounded-2xl
                        ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }
                      `}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}
                      >
                        {message.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Replies */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 bg-white border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Câu hỏi thường gặp:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleSendMessage(reply)}
                        className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

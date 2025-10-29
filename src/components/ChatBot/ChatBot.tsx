import { useState, useRef, useEffect, FormEvent } from 'react';
import { FiSend, FiX, FiCoffee, FiSun } from 'react-icons/fi';
import { FaWineGlassAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatBot.css';

// Menu data from MenuPage
const menuItems = {
  starters: [
    {
      name: 'Cucumber Boats',
      description: 'Chilled cucumber cups filled with spiced chickpeas, tangy yogurt, and mint drizzle.',
      calories: 120,
      cookTime: 'Ready in 10 min',
      pairing: 'Pairs with Sauvignon Blanc or cucumber spritz.',
    },
    {
      name: 'Nachos Salad',
      description: 'Crispy nachos layered with beans, veggies, salsa, and a creamy AI-inspired dressing.',
      calories: 250,
      cookTime: 'Ready in 15 min',
      pairing: 'Loves Pinot Noir or lime soda.',
    },
  ],
  mains: [
    {
      name: 'Bhel Poori',
      description: 'Crispy puffed rice, sev, onion, and tangy chutneys blended with a BiteBuzz twist.',
      calories: 200,
      cookTime: 'Ready in 12 min',
      pairing: 'Try with off-dry Riesling or mango lassi.',
    },
  ],
  drinks: [
    {
      name: 'BiteBuzz Mocktail',
      description: 'A fizzy mix of mint, lemon, and cucumber essence — crafted for balance and buzz.',
      calories: 90,
      cookTime: 'Mixed in 5 min',
      pairing: 'Cools spicy dishes; enjoy with fruit plate.',
    },
  ]
};

const builderBlueprint = {
  intro: '✨ Build Your Own Ceremony Bowl: pick a Base, Protein, Flavor Boost, and Finish. The Genie tracks cook time and pairing tips for you!',
  categories: [
    {
      title: 'Base',
      options: [
        'Ancient Grain Bowl — quinoa, millet, barley (12 min). Pair with citrus spritz.',
        'Leafy Garden Crunch — hydroponic greens, fennel (6 min). Pair with sparkling rosé.',
      ],
    },
    {
      title: 'Protein',
      options: [
        'Charred Herbed Paneer — smoked paprika & fenugreek (8 min). Pair with semi-dry Riesling.',
        'Miso Glazed Tofu — citrus-miso lacquer (7 min). Pair with chilled sake or ginger tonic.',
      ],
    },
    {
      title: 'Flavor Boost',
      options: [
        'Smoky Tamarind Burst — tamarind, chipotle, jaggery (5 min). Pair with hibiscus cooler.',
        'Green Goddess Chill — mint, cilantro yogurt (4 min). Pair with mint spritz.',
      ],
    },
    {
      title: 'Finish',
      options: [
        'Crisp Lotus Crunch — lotus root chips (3 min). Pair with wheat beer or lime soda.',
        'Sesame Seed Furikake — toasted sesame & nori (2 min). Pair with dry cider.',
      ],
    },
  ],
  outro: 'Select one from each pillar in the Menu page builder to see total time and suggested pours in real-time.',
} as const;

const pairingHighlights = [
  {
    title: 'Fresh & Crisp',
    beverage: 'Sauvignon Blanc · Citrus Spritz',
    matches: ['Cucumber Boats', 'Ancient Grain Bowl builds'],
    note: 'Bright acidity keeps herbs lively and balances creamy textures.',
  },
  {
    title: 'Bold & Smoky',
    beverage: 'Pinot Noir · Hibiscus Cooler',
    matches: ['Nachos Salad', 'Smoky Tamarind Burst builds'],
    note: 'Fruity spice mirrors chipotle heat while staying refreshing.',
  },
  {
    title: 'Cooling & Aromatic',
    beverage: 'Mint Mocktail · Off-dry Riesling',
    matches: ['BiteBuzz Mocktail', 'Green Goddess Chill builds'],
    note: 'Sweet aromatics soothe spice and highlight citrus layers.',
  },
] as const;

// Genie lamp SVG
const GenieLamp = () => (
  <svg className="genie-lamp" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 8 5 8 9C8 11.38 9.19 13.47 11 14.74V17H9V19H15V17H13V14.74C14.81 13.47 16 11.38 16 9C16 5 12 2 12 2Z" fill="currentColor"/>
    <path d="M7 10C7 10 5 10 5 12C5 13.66 6.34 15 8 15C9.66 15 11 13.66 11 12C11 10 9 10 9 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Hello! I\'m your Food Genie. Ask me anything about our menu, ingredients, or make special requests!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMenuResponse = (): string => {
    let menuText = '🍽️ *Our Menu* 🍽️\n\n';

    menuText += '🌿 *Starters*\n';
    menuItems.starters.forEach(item => {
      menuText += `• *${item.name}* (${item.calories} kcal)\n`;
      menuText += `  ${item.description}\n`;
      menuText += `  ⏱️ ${item.cookTime} | 🍷 ${item.pairing}\n\n`;
    });

    menuText += '🍛 *Mains*\n';
    menuItems.mains.forEach(item => {
      menuText += `• *${item.name}* (${item.calories} kcal)\n`;
      menuText += `  ${item.description}\n`;
      menuText += `  ⏱️ ${item.cookTime} | 🍷 ${item.pairing}\n\n`;
    });

    menuText += '🍹 *Drinks*\n';
    menuItems.drinks.forEach(item => {
      menuText += `• *${item.name}* (${item.calories} kcal)\n`;
      menuText += `  ${item.description}\n`;
      menuText += `  ⏱️ ${item.cookTime} | 🍷 ${item.pairing}\n\n`;
    });

    menuText += '\nWould you like to know more about any of these dishes?';
    return menuText;
  };

  const getBuilderResponse = (): string => {
    let text = `${builderBlueprint.intro}\n\n`;
    builderBlueprint.categories.forEach((category) => {
      text += `🔹 *${category.title}*\n`;
      category.options.forEach((option) => {
        text += `   • ${option}\n`;
      });
      text += '\n';
    });
    text += `${builderBlueprint.outro}`;
    return text;
  };

  const getPairingResponse = (): string => {
    let text = '🍷 *Wine & Beverage Pairing Guide* 🍹\n\n';
    pairingHighlights.forEach((highlight) => {
      text += `• *${highlight.title}* — ${highlight.beverage}\n`;
      text += `   Matches: ${highlight.matches.join(', ')}\n`;
      text += `   Why: ${highlight.note}\n\n`;
    });
    text += 'Explore the Menu page guide for visuals and build presets!';
    return text;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Check for menu-related queries
    const menuKeywords = ['menu', 'food', 'dishes', 'meals', 'order', 'what do you serve'];
    const isMenuQuery = menuKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );

    const builderKeywords = ['build', 'custom bowl', 'custom dish', 'make my own', 'ceremony bowl'];
    const isBuilderQuery = builderKeywords.some(keyword =>
      input.toLowerCase().includes(keyword)
    );

    const pairingKeywords = ['wine', 'pairing', 'drink pairing', 'beverage', 'what to drink'];
    const isPairingQuery = pairingKeywords.some(keyword =>
      input.toLowerCase().includes(keyword)
    );

    if (isMenuQuery) {
      setTimeout(() => {
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: getMenuResponse()
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    if (isBuilderQuery) {
      setTimeout(() => {
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: getBuilderResponse()
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    if (isPairingQuery) {
      setTimeout(() => {
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: getPairingResponse()
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_OPENROUTE_API_KEY;
      const model = import.meta.env.VITE_OPENROUTE_MODEL || 'mistralai/mistral-7b-instruct:free';
      
      if (!apiKey) {
        throw new Error('OpenRoute API key is not configured');
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href, // For tracking purposes
          'X-Title': 'Food App ChatBot' // For tracking purposes
        },
        body: JSON.stringify({
          model: model,
          messages: [...messages, userMessage],
          temperature: 0.7,
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessages((prev: Message[]) => [...prev, { 
          role: 'assistant' as const, 
          content: data.choices[0].message.content 
        }]);
      }
    } catch (error) {
      console.error('Error calling OpenRoute API:', error);
      setMessages((prev: Message[]) => [...prev, { 
        role: 'assistant' as const, 
        content: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatWindowRef.current && 
        !chatWindowRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.chatbot-toggle')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chatbot-window"
          >
            <div className="chatbot-header">
              <GenieLamp />
              <span>Food Genie</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="chatbot-close"
                aria-label="Close chat"
              >
                <FiX />
              </button>
            </div>
            
            <div className="chatbot-messages">
              {messages.map((message: Message, index: number) => (
                <div 
                  key={index} 
                  className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
                >
                  <div className="message-bubble">
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="chatbot-input-container">
              <form onSubmit={handleSubmit} className="chatbot-form">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="chatbot-input"
                  disabled={isLoading}
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="chatbot-submit"
                  aria-label="Send message"
                >
                  <FiSend />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="chatbot-toggle"
          aria-label="Summon Food Genie"
        >
          <GenieLamp />
        </motion.button>
      )}
    </div>
  );
};

export default ChatBot;

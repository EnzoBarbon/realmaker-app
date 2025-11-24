'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

interface Contact {
  id: string;
  phone: string;
  name: string | null;
}

interface Message {
  id: string;
  body: string;
  direction: 'INBOUND' | 'OUTBOUND';
  createdAt: string;
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
      const interval = setInterval(() => fetchMessages(selectedContact.id), 2000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchContacts = async () => {
    const res = await fetch('/api/contacts');
    const data = await res.json();
    setContacts(data);
  };

  const fetchMessages = async (contactId: string) => {
    const res = await fetch('/api/messages?contactId=' + contactId);
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    setLoading(true);
    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: selectedContact.phone,
          body: newMessage,
        }),
      });
      setNewMessage('');
    } catch (err) {
      alert('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  const createContact = async () => {
    const phone = prompt('Enter phone number:');
    if (!phone) return;

    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: phone,
          body: 'Initial connection',
        }),
      });
      setTimeout(fetchContacts, 1000);
    } catch (err) {
      alert('Error creating contact');
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Contacts</h2>
          <button onClick={createContact} className={styles.newButton}>
            + New
          </button>
        </div>
        <div className={styles.contactList}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`${styles.contactItem} ${selectedContact?.id === contact.id ? styles.active : ''}`}
            >
              <div className={styles.contactPhone}>{contact.phone}</div>
              <div className={styles.contactName}>{contact.name || 'Unknown'}</div>
            </div>
          ))}
          {contacts.length === 0 && <div className={styles.contactItem}>No contacts yet</div>}
        </div>
      </div>

      <div className={styles.chatArea}>
        {selectedContact ? (
          <>
            <div className={styles.chatHeader}>Chat with {selectedContact.phone}</div>
            <div className={styles.messages}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.messageWrapper} ${msg.direction === 'OUTBOUND' ? styles.outbound : styles.inbound}`}
                >
                  <div className={styles.message}>
                    <div>{msg.body}</div>
                    <div className={styles.timestamp}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className={styles.inputArea}>
              <form onSubmit={sendMessage} className={styles.form}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={styles.input}
                  placeholder="Type a message..."
                  disabled={loading}
                />
                <button type="submit" className={styles.sendButton} disabled={loading}>
                  Send
                </button>
              </form>
              <div className={styles.helperText}>
                This simulates the CLIENT sending a message to RealMaker
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>Select a contact to view conversation</div>
        )}
      </div>
    </main>
  );
}

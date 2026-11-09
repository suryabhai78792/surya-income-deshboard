import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

export default function Settings({ isOpen, setIsSettingsOpen, banks, logoMap }) {
  if (!isOpen) return null;

  // हर कार्ड के लिए सेलेक्टेड बैंक की स्टेट (साथ में कार्ड के नाम भी डिफाइन कर सकते हैं)
  const [selectedBanks, setSelectedBanks] = useState({
    card1: { bankId: 'bank1', title: 'Cash Received' },
    card2: { bankId: 'bank2', title: 'Savings' },
    card3: { bankId: 'bank3', title: 'Emergency' },
    card4: { bankId: 'bank4', title: 'Loan' },
    card5: { bankId: 'bank5', title: 'Expenses' },
    card6: { bankId: 'bank6', title: 'Visiting' },
    card7: { bankId: 'bank7', title: 'Home' },

  });

  // ट्रैक करने के लिए कि किस कार्ड का ड्रॉपडाउन ओपन है
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSelectBank = (cardKey, bankId) => {
    setSelectedBanks((prev) => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        bankId: bankId,
      },
    }));
    setOpenDropdown(null); // बैंक सेलेक्ट करने के बाद ड्रॉपडाउन बंद हो जाएगा
  };

  const renderBankCard = (cardKey) => {
    const cardData = selectedBanks[cardKey];
    const bankItem = banks.find((b) => b.id === cardData.bankId);

    if (!bankItem) return null;

    const LogoComponent = logoMap[bankItem.logo];
    const isDropdownOpen = openDropdown === cardKey;

    return (
      <div
        key={cardKey}
        style={{
          background: bankItem.gradient || 'linear-gradient(135deg, #00646b 0%, #002222 100%)',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          position: 'relative',
        }}
      >
        {/* ================= CARD HEADER (दो भागों में विभाजित) ================= */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          
          {/* 1. बायां हिस्सा: कार्ड का नाम (Card Title) */}
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff' }}>
            {cardData.title}
          </div>

          {/* 2. दायां हिस्सा: बैंक लोगो, नाम और ड्रॉपडाउन ट्रिगर बटन */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {LogoComponent && <LogoComponent />}
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ffffff' }}>
                {bankItem.bank.toUpperCase()}
              </div>
            </div>

            {/* ड्रॉपडाउन ट्रिगर (तीर का निशान बटन) */}
            <button
              onClick={() => setOpenDropdown(isDropdownOpen ? null : cardKey)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
              }}
            >
              <ChevronDown size={16} />
            </button>

            {/* कस्टम ड्रॉपडाउन लिस्ट */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                  zIndex: 100,
                  width: '240px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                  SELECT BANK
                </div>
                {banks.map((b) => {
                  const ItemLogo = logoMap[b.logo];
                  return (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBank(cardKey, b.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: b.id === cardData.bankId ? '#f8fafc' : '#ffffff',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = b.id === cardData.bankId ? '#f8fafc' : '#ffffff')}
                    >
                      {ItemLogo && <ItemLogo />}
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>{b.bank.toUpperCase()}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.bankFullName}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* बीच की डिवाइडर लाइन */}
        <span
          style={{
            display: 'block',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            width: '100%',
          }}
        ></span>

        {/* कार्ड का निचला हिस्सा: अकाउंट होल्डर और अमाउंट */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
            {bankItem.accountHolder || 'Account Holder'}
          </span>
          <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
            {bankItem.amount || '₹ 0'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        style={{
          background: '#ffffff', // लाइट मोड पॉपअप बैकग्राउंड
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '24px',
          width: '90%',
          maxWidth: '460px',
          color: '#0f172a',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* क्लोज बटन */}
        <button
          onClick={() => setIsSettingsOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>
          Settings
        </h2>

        {/* कार्ड्स की लिस्ट */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {renderBankCard('card1')}
          {renderBankCard('card2')}
        </div>
      </div>
    </div>
  );
}
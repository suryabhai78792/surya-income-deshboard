import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Landmark, Waves, ArrowDown, ArrowUp, ArrowRight, Wallet, Coins,
  ShieldCheck, FileText, Plane, House, CircleDollarSign, Utensils,
  Flower2, CircleUserRound, X, Settings
} from 'lucide-react';
import './Budgets.css';
import SettingsPopup from './components/Settings';
import IppbLogo from './IPPBLogo.png'
import BOILogo from './BOILogo.png'
import PNBLogo from './PNBLogo.png'
import SBILogo from './SBILogo.png'

// लोगो को सीधे एक कॉम्पोनेंट या फ़ंक्शन की तरह मैप करें
const logoMap = {
  ippb: () => (
    <img
      src={IppbLogo}
      alt="Bank Logo"
      className="border-2 border-white rounded-full p-0.4"
      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
    />
  ),
  boi: () => (
    <img
      src={BOILogo}
      alt="Bank Logo"
      className="border-2 border-white rounded-full p-0.4"
      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
    />
  ),
  pnb: () => (
    <img
      src={PNBLogo}
      alt="Bank Logo"
      className="border-2 border-white rounded-full p-0.4"
      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
    />
  ),
  sbi: () => (
    <img
      src={SBILogo}
      alt="Bank Logo"
      className="border-2 border-white rounded-full p-0.4"
      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
    />
  ),
  // भविष्य में कोई दूसरा बैंक जोड़ना हो तो यहाँ जोड़ सकते हैं:
  // sbi: () => <img src={SbiLogo} ... />
};

const banks = [
  {
    id: 'bank1',
    bank: 'ippb',
    bankFullName: 'Indian Post Payment Bank',
    address: 'Uttar',
    accountNumber: '1752000100276184',
    accountHolder: 'Surya Narayan Sharma',
    amount: '₹ 30,000',
    tone: 'blue',
    logo: 'ippb', // यहाँ सिर्फ नाम देना है
    gradient: 'linear-gradient(135deg, #00646b 0%, #002222 100%)'
  },
  {
    id: 'bank2',
    bank: 'boi',
    bankFullName: 'Bank of India',
    address: 'Saharghat',
    accountNumber: '1752000100276184',
    accountHolder: 'Surya Narayan Sharma',
    amount: '₹ 30,000',
    tone: 'blue',
    logo: 'boi', // यहाँ सिर्फ नाम देना है
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)'
  },
  {
    id: 'bank3',
    bank: 'pnb',
    bankFullName: 'Punjab National Bank',
    address: 'Gangaur',
    accountNumber: '1752000100276184',
    accountHolder: 'Surya Narayan Sharma',
    amount: '₹ 30,000',
    tone: 'blue',
    logo: 'pnb', // यहाँ सिर्फ नाम देना है
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #431407 100%)'
  },
  {
    id: 'bank4',
    bank: 'sbi',
    bankFullName: 'State Bank of India',
    address: 'Saharghat',
    accountNumber: '1752000100276184',
    accountHolder: 'Surya Narayan Sharma',
    amount: '₹ 30,000',
    tone: 'blue',
    logo: 'sbi', // यहाँ सिर्फ नाम देना है
    gradient: 'linear-gradient(135deg, #09c3e4 0%, #04aecc 100%)'
  },

];



const topCards = [
  { id: 'feb', bank: 'IPPB Bank', month: 'February 2027', label: 'Cash Received', amount: '₹ 30,000', note: '(100%)', tone: 'blue', direction: 'down', icon: Landmark },
  { id: 'jan', bank: 'IPPB Bank', month: 'January 2027', label: 'Income Balance', amount: '₹ 25,000', note: '(100%)', tone: 'green', direction: 'up', icon: Landmark },
  { id: 'dec', bank: 'IPPB Bank', month: 'December 2026', label: 'Income Balance', amount: '₹ 28,000', note: '(100%)', tone: 'green', direction: 'up', icon: Landmark },
  { id: 'nov', bank: 'IPPB Bank', month: 'November 2026', label: 'Income Balance', amount: '₹ 29,000', note: '(100%)', tone: 'green', direction: 'up', icon: Landmark },
];

const accounts = [
  { id: 'post-office-saving', bank: 'Post office Bank', month: 'October 2026', label: 'Saving (20%)', amount: '₹ 4,500', note: '(4000+500)', tone: 'yellow', icon: Coins },
  { id: 'sbi-emergency', bank: 'SBI', month: 'October 2026', label: 'Emergency fund (10%)', amount: '₹ 4,000', note: '(3500+500)', tone: 'blue', icon: ShieldCheck },
  { id: 'central-loan', bank: 'Central Bank', month: 'October 2026', label: 'Loan (20%)', amount: '₹ 29,000', note: '(15000+5000)', tone: 'green', icon: FileText },
  { id: 'pnb-expense', bank: 'PNB Bank', month: 'October 2026', label: 'Expense (50%)', amount: '₹ 15,000', note: '(10000+5000)', tone: 'blue', icon: Utensils },
  { id: 'post-office-visiting', bank: 'POST office', month: 'October 2026', label: 'Visiting fund', amount: '₹ 2,500', note: '(2000+500)', tone: 'yellow', icon: Plane },
  { id: 'boi-home', bank: 'BOI Bank', month: 'October 2026', label: 'Home clothing medicine', amount: '₹ 14,000', note: '(12000+2000)', tone: 'green', icon: House },
];

function Card({ item, selected, onClick, compact = false }) {
  const MainIcon = item.icon || Landmark;
  const FlowIcon = item.direction === 'up' ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      className={`bank-card ${item.tone} ${compact ? 'account-card' : 'summary-card'} ${selected ? 'selected' : ''}`}
      onClick={() => onClick(item)}
      aria-pressed={selected}
      aria-label={`${item.bank || 'Account'} ${item.month}, ${item.label}, ${item.amount}`}
    >
      <span className="card-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="card-title-row">
              <span className="card-bank">{item.bank}</span>
            </span>
            <span className="card-month">{item.month}</span>
          </div>
          <div className="icon-ring" style={{ margin: 0 }}>
            <img src={IppbLogo} alt="IPPB Logo" />
          </div>
        </div>
        <span className="card-rule" />
        <span className="card-label-row">
          {compact ? <MainIcon className="mini-icon" size={27} strokeWidth={2.2} /> : <FlowIcon className="mini-icon" size={28} strokeWidth={3} />}
          <span className="card-label">{item.label}</span>
        </span>
        <span className="amount-row"><strong>{item.amount}</strong> <span>{item.note}</span></span>
      </span>
    </button>
  );
}

export default function BudgetsView() {
  const [selected, setSelected] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const handleSelect = (item) => setSelected(item);
  return (
    <main className="page-shell min-h-screen w-full px-4 py-7 sm:px-6 sm:py-10">
      <div className="dashboard mx-auto w-full max-w-5xl ">


        <SettingsPopup
          isOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          banks={banks}
          logoMap={logoMap}
        />


        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '10px' }}>
          <button
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open Settings"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff', float: 'right', marginRight: '10px' }}
          >
            <Settings size={24} />
          </button>
        </div>



        <section className="balance-panel">
          <button className={`balance-heading ${selected?.id === 'october-balance' ? 'selected' : ''}`} onClick={() => handleSelect({ id: 'october-balance', bank: 'October 2026 Balance', month: 'October 2026', label: 'Total balance', amount: '₹ 80,000', note: '' })}>
            <span>Cash Received</span>
            <div className="icon-ring" style={{ margin: 0 }}>
              <img src={IppbLogo} alt="IPPB Logo" />
            </div>
            <span>IPPB Balance</span>
            <strong>₹ 80,000</strong>
          </button>
          <div className="connector connector-top" aria-hidden="true"><ArrowRight size={22} /></div>
          <div className="account-grid">
            {topCards.slice(0, 4).map((item) => <Card key={item.id} item={item} selected={selected?.id === item.id} onClick={handleSelect} />)}
          </div>
        </section>

        <div className="connector connector-middle" aria-hidden="true"><span /></div>

        <section className="balance-panel">
          <button className={`balance-heading ${selected?.id === 'october-balance' ? 'selected' : ''}`} onClick={() => handleSelect({ id: 'october-balance', bank: 'October 2026 Balance', month: 'October 2026', label: 'Total balance', amount: '₹ 80,000', note: '' })}>
            <Wallet size={39} strokeWidth={2.2} />
            <span>October 2026 Balance</span>
            <strong>₹ 80,000</strong>
          </button>
          <div className="account-grid">
            {accounts.slice(0, 4).map((item) => <Card key={item.id} item={item} compact selected={selected?.id === item.id} onClick={handleSelect} />)}
          </div>
        </section>

        <div className="connector connector-bottom" aria-hidden="true"><span /><span /></div>
        <section className="bottom-grid" aria-label="Other October accounts">
          {accounts.slice(4).map((item) => <Card key={item.id} item={item} compact selected={selected?.id === item.id} onClick={handleSelect} />)}
        </section>

        {selected && (
          <div className="selection-panel" role="status">
            <div className={`selection-icon ${selected.tone || 'blue'}`}><CircleDollarSign size={22} /></div>
            <div className="selection-copy">
              <span className="selection-eyebrow">Selected card</span>
              <strong>{selected.bank}</strong>
              <span>{selected.month} · {selected.label} · {selected.amount}</span>
            </div>
            <button className="clear-selection" onClick={() => setSelected(null)} aria-label="Clear selection"><X size={19} /></button>
          </div>
        )}
        <p className="page-note">Click any card to select it. This is a visual demo; no banking actions are performed.</p>
      </div>
    </main>
  );
}



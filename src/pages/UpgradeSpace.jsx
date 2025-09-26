import React, { useState } from 'react';

const UpgradeSpace = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const plans = [
    {
      id: 'pro',
      title: 'Pro',
      subheading: 'Most popular',
      paymentType: 'Pay monthly',
      saveInfo: 'Save 5%',
      price: '49/-/mo',
      offerNote: 'For 1 month with offer',
      ariaLabel: 'Upgrade to Pro plan'
    },
    {
      id: 'premium',
      title: 'Premium',
      subheading: 'Most popular',
      paymentType: 'Pay Annually',
      saveInfo: 'Save 15%',
      price: '549/-/mo',
      offerNote: 'For 1 Year with offer',
      ariaLabel: 'Upgrade to Premium plan'
    }
  ];

  const handleCardClick = (planId) => {
    setSelectedCard(planId);
  };

  const handleUpgrade = async (planId) => {
    alert(`(Simulated) Upgrade requested for plan: ${planId}\nReplace this with a POST /api/upgrade call in handleUpgrade.`);
  };

  // Common card style for both Pro and Premium
  const baseCardStyle = {
    width: '350px',
    height: '420px',
    borderRadius: '30px',
    boxShadow: '0px 4px 12px 0px #0000001A',
    boxSizing: 'border-box',
    padding: '30px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    color: '#000',
    margin: '0 10px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      background: '#fff',
      margin: '40px',
      color: '#000',
    },
    h1: {
      textAlign: 'center',
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 700,
      fontSize: '45px',
      fontStyle: 'normal',
      lineHeight: '100%',
      letterSpacing: '0%',
      marginBottom: '40px',
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
    },
    card: baseCardStyle,
    cardSelected: {
      backgroundColor: '#3aa2ff',
      color: '#fff',
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    },
    cardH2: {
      fontWeight: '700',
      marginBottom: '10px',
    },
    subheading: {
      fontWeight: '700',
      marginBottom: '25px',
    },
    paymentType: {
      fontWeight: '400',
      fontSize: '16px',
      marginBottom: '3px',
    },
    saveInfo: {
      fontWeight: '300',
      fontSize: '14px',
      marginBottom: '20px',
      opacity: '0.8',
    },
    price: {
      fontWeight: '400',
      fontSize: '18px',
      marginBottom: '3px',
    },
    offerNote: {
      fontWeight: '300',
      fontSize: '14px',
      marginBottom: '40px',
      opacity: '0.8',
    },
    btnUpgrade: {
      fontWeight: '700',
      fontSize: '16px',
      padding: '12px 0',
      borderRadius: '15px',
      border: '1px solid #c9e5ff',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box',
      background: '#fff',
      color: '#000',
      transition: '0.3s ease',
    },
    btnUpgradeHover: {
      background: '#fff',
      color: '#000',
      border: 'none',
    }
  };

  return (
    <div style={styles.body}>
      {/* Optional: ensure Open Sans font is imported globally */}
      {/* <link href="https://fonts.googleapis.com/css?family=Open+Sans:700&display=swap" rel="stylesheet" /> */}
      <style>
        {`
          .card:hover {
            background-color: #42a5f5 !important;
            color: #fff !important;
          }
          
          .card:hover .btn-upgrade {
            background: #fff !important;
            color: #000 !important;
            border: none !important;
          }
          
          .card.selected .btn-upgrade {
            background: #fff !important;
            color: #000 !important;
            border: none !important;
          }
          
          .btn-upgrade:hover {
            opacity: 0.9;
          }

          @media (max-width: 900px) {
            .container {
              flex-direction: column;
              align-items: center;
            }
          }
        `}
      </style>
      
      <h1 style={styles.h1}>Upgrade Your Space</h1>
      <div style={styles.container} className="container">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card ${plan.id} ${selectedCard === plan.id ? 'selected' : ''}`}
            style={{
              ...styles.card,
              ...(selectedCard === plan.id ? styles.cardSelected : {})
            }}
            role="region"
            aria-labelledby={`${plan.id}-heading`}
            tabIndex="0"
            onClick={() => handleCardClick(plan.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(plan.id);
              }
            }}
          >
            <h2 style={styles.cardH2} id={`${plan.id}-heading`}>{plan.title}</h2>
            <div style={styles.subheading} className="subheading">{plan.subheading}</div>
            <div style={styles.paymentType} className="payment-type">{plan.paymentType}</div>
            <div style={styles.saveInfo} className="save-info">{plan.saveInfo}</div>
            <div style={styles.price} className="price">{plan.price}</div>
            <div style={styles.offerNote} className="offer-note">{plan.offerNote}</div>
            <button 
              style={styles.btnUpgrade}
              className="btn-upgrade"
              type="button"
              aria-label={plan.ariaLabel}
              onClick={() => handleUpgrade(plan.id)}
            >
              Upgrade
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradeSpace;

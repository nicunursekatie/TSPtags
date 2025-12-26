import React, { useState, useEffect } from 'react';
import { Instagram, Mail, User, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// ⚠️ YOUR GOOGLE SCRIPT URL IS PRE-FILLED HERE:
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwUTzMnuimAU1RGh7bOS1zA4NVEwXmbJXt0b-mVNJJ8KzfOaJRaaaK_3Smyg4CRaCbH/exec';

// ⚠️ REPLACE THIS with a real image URL when you can. 
// For now, it points to a placeholder so it doesn't break.
const LOGO_URL = 'https://thesandwichproject.org/wp-content/uploads/2021/08/logo.png'; 

function App() {
  const [companyName, setCompanyName] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instagram: '',
    email: '',
    photoPermission: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const company = params.get('company');
    const dateParam = params.get('date');

    if (company) setCompanyName(decodeURIComponent(company));
    if (dateParam) {
      setEventDate(dateParam);
    } else {
      setEventDate(new Date().toISOString().split('T')[0]);
    }
  }, []);

  const formatInstagram = (value) => {
    const cleaned = value.replace(/[@\s]/g, '');
    return cleaned ? `@${cleaned}` : '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleBlur = (e) => {
    if (e.target.name === 'instagram' && formData.instagram.trim()) {
      setFormData(prev => ({
        ...prev,
        instagram: formatInstagram(prev.instagram)
      }));
    }
  };

  const fireConfetti = () => {
    const colors = ['#236383', '#fbad3f', '#007e8c', '#47b3cb', '#a31c41'];
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.instagram.trim()) newErrors.instagram = 'Handle is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const submissionData = {
      name: formData.name.trim(),
      instagram: formatInstagram(formData.instagram),
      email: formData.email.trim() || null,
      photoPermission: formData.photoPermission,
      company: companyName || null,
      eventDate: eventDate,
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      setIsSubmitted(true);
      fireConfetti();
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- STYLES ---
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(180deg, #f0f8f9 0%, #e5f3f5 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      padding: '40px 30px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    inputGroup: { marginBottom: '15px', position: 'relative' },
    input: (hasError) => ({
      width: '100%',
      padding: '16px 16px 16px 48px',
      borderRadius: '12px',
      border: `2px solid ${hasError ? '#a31c41' : 'transparent'}`,
      backgroundColor: hasError ? '#fef2f2' : '#f3f4f6',
      fontSize: '16px',
      outline: 'none',
      boxSizing: 'border-box', // Crucial for padding
      transition: 'all 0.2s',
    }),
    icon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#47b3cb',
      width: '20px',
      height: '20px',
    },
    button: {
      width: '100%',
      backgroundColor: '#236383',
      color: 'white',
      fontWeight: 'bold',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '16px',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      opacity: isSubmitting ? 0.7 : 1,
      marginTop: '10px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    errorText: { color: '#a31c41', fontSize: '12px', marginTop: '4px', marginLeft: '4px' },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      fontSize: '12px',
      color: '#6b7280',
      lineHeight: '1.5',
      marginBottom: '20px',
      cursor: 'pointer',
    }
  };

  if (isSubmitted) {
    return (
      <div style={styles.container}>
        <div style={{...styles.card, textAlign: 'center'}}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #fbad3f 0%, #007e8c 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <Heart color="white" fill="white" size={40} />
          </div>
          <h1 style={{color: '#236383', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>Got it!</h1>
          <p style={{color: '#4b5563', marginBottom: '24px'}}>Watch our feed for your photo tag.</p>
          <a href="https://instagram.com/thesandwichprojectatl" target="_blank" rel="noopener noreferrer" 
             style={{...styles.button, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', backgroundColor: '#007e8c'}}>
            <Instagram size={20} /> @thesandwichprojectatl
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{textAlign: 'center', marginBottom: '24px'}}>
          <img src={LOGO_URL} alt="Logo" style={{height: '60px', margin: '0 auto 16px', objectFit: 'contain'}} />
          <h1 style={{color: '#236383', fontSize: '20px', fontWeight: 'bold', lineHeight: '1.2'}}>
            {companyName ? `Thanks for volunteering with ${companyName}!` : 'Thanks for volunteering!'}
          </h1>
          <p style={{color: '#47b3cb', fontSize: '14px', marginTop: '8px'}}>Drop your Instagram so we can tag you</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <User style={styles.icon} />
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              style={{...styles.input(errors.name), borderColor: errors.name ? '#a31c41' : 'transparent'}}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          <div style={styles.inputGroup}>
            <Instagram style={styles.icon} />
            <input
              type="text"
              name="instagram"
              placeholder="@yourhandle"
              value={formData.instagram}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{...styles.input(errors.instagram), borderColor: errors.instagram ? '#a31c41' : 'transparent'}}
            />
            {errors.instagram && <p style={styles.errorText}>{errors.instagram}</p>}
          </div>

          <div style={styles.inputGroup}>
            <Mail style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Email (for newsletter updates)"
              value={formData.email}
              onChange={handleChange}
              style={styles.input(false)}
            />
          </div>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="photoPermission"
              checked={formData.photoPermission}
              onChange={handleChange}
              style={{marginTop: '3px'}}
            />
            <span>I grant The Sandwich Project permission to use photos of me for social media and promotional purposes.</span>
          </label>

          <button type="submit" style={styles.button}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        
        <div style={{marginTop: '24px', textAlign: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '16px'}}>
           <p style={{fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}>
             <Sparkles size={12} color="#fbad3f" /> Fighting food insecurity <Sparkles size={12} color="#fbad3f" />
           </p>
        </div>
      </div>
    </div>
  );
}

export default App;
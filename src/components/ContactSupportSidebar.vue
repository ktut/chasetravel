<template>
  <div class="contact-support-card">
    <h2>Contact Support</h2>

    <!-- Phone Numbers -->
    <div class="support-section">
      <h3>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
        </svg>
        Call Us
      </h3>
      <div class="support-item prominent">
        <div class="support-label">Chase Travel Specialist</div>
        <a href="tel:888-511-5326" class="support-link phone">888-511-5326</a>
      </div>
      <div class="support-item prominent">
        <div class="support-label">Chase Sapphire Reserve Support</div>
        <div class="support-sublabel reserve-label">For Chase Sapphire Reserve Cardholders</div>
        <a href="tel:800-436-7970" class="support-link phone">800-436-7970</a>
        <div class="support-sublabel">USA</div>
        <a href="tel:614-776-7050" class="support-link phone secondary-phone">614-776-7050</a>
        <div class="support-sublabel">International</div>
      </div>
    </div>

    <!-- iMessage Support -->
    <div class="support-section">
      <h3>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        Message Us
      </h3>
      <a href="sms:&body=I need help with my Chase Travel booking" class="support-item imessage-link">
        <img src="@/assets/imessage.png" alt="iMessage" class="imessage-icon" />
        <span>Contact via iMessage</span>
      </a>
    </div>

    <!-- Email Support -->
    <div class="support-section">
      <h3>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        Email Us
      </h3>
      <div class="support-item">
        <a href="mailto:help@chasetravel.com" class="support-link email">help@chasetravel.com</a>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="support-section">
      <h3>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Send Us a Message
      </h3>

      <form @submit.prevent="submitContactForm" class="contact-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="contactForm.name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="contactForm.email" required />
        </div>
        <div class="form-group">
          <label for="subject">Subject</label>
          <input type="text" id="subject" v-model="contactForm.subject" required />
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" v-model="contactForm.message" rows="4" required></textarea>
        </div>
        <button type="submit" class="btn-primary">Send Message</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContactSupportSidebar',
  data() {
    return {
      contactForm: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  },
  methods: {
    submitContactForm() {
      alert('Contact form submitted! (This is a placeholder - not functional yet)')
      this.contactForm = { name: '', email: '', subject: '', message: '' }
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

.contact-support-card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: $color-primary;
  }
}

.support-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e5e5;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: $color-primary;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      width: 18px;
      height: 18px;
    }
  }
}

.support-item {
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  &.prominent {
    background: #f8f8f8;
    padding: 1rem;
    border-left: 3px solid $color-accent;
  }

  &.imessage-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #f0f7ff;
    border: 1px solid #d0e7ff;
    border-radius: 6px;
    text-decoration: none;
    color: $color-accent;
    font-weight: 600;
    transition: all 0.2s;

    &:hover {
      background: #e6f2ff;
      border-color: $color-accent;
    }

    .imessage-icon {
      width: 32px;
      height: 32px;
    }
  }
}

.support-label {
  font-weight: 600;
  color: $color-primary;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.support-sublabel {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;

  &.reserve-label {
    font-size: 0.8rem;
    color: $color-accent;
    font-weight: 600;
    margin-bottom: 0.75rem;
    margin-top: 0;
  }
}

.support-link {
  display: inline-block;
  text-decoration: none;
  transition: all 0.2s;

  &.phone {
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-accent;

    &:hover {
      color: #004a94;
    }

    &.secondary-phone {
      margin-top: 0.75rem;
      display: block;
    }
  }

  &.email {
    color: $color-accent;
    text-decoration: underline;

    &:hover {
      color: #004a94;
    }
  }
}

.contact-form {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
    color: $color-primary;
    font-size: 0.875rem;
  }

  input,
  textarea {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.95rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: $color-accent;
      box-shadow: 0 0 0 2px rgba(29, 79, 145, 0.1);
    }
  }

  textarea {
    resize: vertical;
  }
}
</style>

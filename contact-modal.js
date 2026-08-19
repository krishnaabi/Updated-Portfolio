(() => {
  // Hyper-Minimal Architectural Contact Sheet
  const modal = document.createElement('div');
  modal.className = 'contact-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="contact-dialog" role="dialog" aria-modal="true" aria-label="Contact">
      <button class="modal-close" aria-label="Close">✕</button>

      <div class="minimal-sheet-inner">
        <!-- Minimal Tab Switcher -->
        <div class="tab-switcher">
          <button type="button" class="tab-btn active" id="tab-project">Start a project</button>
          <button type="button" class="tab-btn" id="tab-hello">Say hello</button>
        </div>

        <div class="sheet-header">
          <h2 id="sheet-title">Let’s build something <em>together.</em></h2>
          <p id="sheet-sub">Tell me about your project, timeline, or scope.</p>
        </div>

        <form class="contact-form" id="sheet-form">
          <div class="field-line">
            <input type="text" name="name" required placeholder="Your name" />
            <span class="line-bar"></span>
          </div>

          <div class="field-line">
            <input type="email" name="email" required placeholder="Your email address" />
            <span class="line-bar"></span>
          </div>

          <div class="field-line" id="project-type-field">
            <select name="projectType">
              <option value="Product Design (UI/UX)">Product Design (UI/UX)</option>
              <option value="Web & Platform Development">Web & Platform Development</option>
              <option value="Design System">Design System Architecture</option>
              <option value="Brand Experience">Brand Experience & Motion</option>
            </select>
            <span class="line-bar"></span>
          </div>

          <div class="field-line">
            <textarea name="message" rows="3" required placeholder="Your message..."></textarea>
            <span class="line-bar"></span>
          </div>

          <button class="submit-pill-btn" type="submit" id="sheet-submit">
            <span>Send Proposal</span>
            <span class="arrow">↗</span>
          </button>
        </form>

        <div class="sheet-success" id="sheet-success" style="display:none;">
          <div class="success-dot"></div>
          <h3>Message Sent</h3>
          <p>Thank you for reaching out. Abi will reply shortly.</p>
          <button type="button" class="done-btn" id="sheet-done-btn">Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.append(modal);

  // Architectural Minimal CSS
  const style = document.createElement('style');
  style.textContent = `
    .contact-modal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      padding: 16px;
      background: rgba(12, 12, 12, 0.55);
      backdrop-filter: blur(16px);
      opacity: 0;
      pointer-events: none;
      place-items: center;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .contact-modal.open {
      opacity: 1;
      pointer-events: auto;
    }
    .contact-dialog {
      position: relative;
      width: min(480px, 94vw);
      background: #111110;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 28px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
      transform: translateY(24px) scale(0.97);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .contact-modal.open .contact-dialog {
      transform: translateY(0) scale(1);
    }
    .modal-close {
      position: absolute;
      top: 22px;
      right: 22px;
      display: grid;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.06);
      border: 0;
      border-radius: 50%;
      font-size: 14px;
      color: #a09d98;
      cursor: pointer;
      place-items: center;
      transition: all 0.2s ease;
    }
    .modal-close:hover {
      background: #ff4e1b;
      color: #ffffff;
    }

    .minimal-sheet-inner {
      padding: 40px 36px 36px;
    }

    /* Tab Switcher */
    .tab-switcher {
      display: inline-flex;
      gap: 4px;
      padding: 4px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 99px;
      margin-bottom: 24px;
    }
    .tab-btn {
      padding: 7px 16px;
      background: transparent;
      border: 0;
      border-radius: 99px;
      font: 700 12px 'Manrope', sans-serif;
      color: #888580;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .tab-btn.active {
      background: #ffffff;
      color: #111110;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    /* Sheet Header */
    .sheet-header {
      margin-bottom: 28px;
    }
    .sheet-header h2 {
      margin: 0 0 8px;
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -1.2px;
      line-height: 1.2;
      color: #ffffff;
    }
    .sheet-header em {
      font-family: 'Georgia', serif;
      font-style: italic;
      font-weight: 400;
      color: #ff4e1b;
    }
    .sheet-header p {
      margin: 0;
      color: #888580;
      font-size: 13.5px;
      line-height: 1.4;
    }

    /* Form Lines */
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .field-line {
      position: relative;
    }
    .field-line input,
    .field-line select,
    .field-line textarea {
      width: 100%;
      padding: 12px 0;
      background: transparent;
      border: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.14);
      font: 600 14px 'Manrope', sans-serif;
      color: #ffffff;
      outline: none;
      transition: border-color 0.25s ease;
    }
    .field-line select {
      appearance: none;
      cursor: pointer;
      color: #ff8a65;
    }
    .field-line select option {
      background: #181817;
      color: #ffffff;
    }
    .field-line textarea {
      resize: none;
    }
    .field-line input::placeholder,
    .field-line textarea::placeholder {
      color: #55524e;
      font-weight: 500;
    }
    .field-line input:focus,
    .field-line select:focus,
    .field-line textarea:focus {
      border-bottom-color: #ff4e1b;
    }

    /* Submit Button */
    .submit-pill-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 50px;
      padding: 0 24px;
      margin-top: 12px;
      background: #ffffff;
      color: #111110;
      border: 0;
      border-radius: 99px;
      font: 800 13.5px 'Manrope', sans-serif;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .submit-pill-btn:hover {
      background: #ff4e1b;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(255, 78, 27, 0.35);
    }
    .submit-pill-btn .arrow {
      font-size: 16px;
      transition: transform 0.25s ease;
    }
    .submit-pill-btn:hover .arrow {
      transform: translate(3px, -3px);
    }

    /* Success State */
    .sheet-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px 0 12px;
    }
    .success-dot {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      background: rgba(255, 78, 27, 0.15);
      border: 1.5px solid #ff4e1b;
      border-radius: 50%;
      display: grid;
      place-items: center;
    }
    .success-dot:after {
      content: "✓";
      color: #ff4e1b;
      font-weight: 800;
      font-size: 20px;
    }
    .sheet-success h3 {
      margin: 0 0 6px;
      font-size: 22px;
      font-weight: 800;
    }
    .sheet-success p {
      margin: 0 0 20px;
      color: #888580;
      font-size: 13.5px;
    }
    .done-btn {
      padding: 10px 28px;
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border: 0;
      border-radius: 99px;
      font: 700 12.5px 'Manrope', sans-serif;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .done-btn:hover {
      background: #ffffff;
      color: #111110;
    }

    @media (max-width: 500px) {
      .minimal-sheet-inner {
        padding: 32px 24px;
      }
    }
  `;
  document.head.append(style);

  // State Management
  const open = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  };

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      const form = modal.querySelector('#sheet-form');
      const success = modal.querySelector('#sheet-success');
      if (form && success) {
        form.style.display = 'flex';
        success.style.display = 'none';
      }
    }, 300);
  };

  // Triggers
  document.querySelectorAll('.talk-link, a[href="#contact-modal"], button[data-contact-trigger]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      open();
    });
  });

  // Close handler: ONLY the explicit Close button (✕) closes the modal
  modal.querySelector('.modal-close').addEventListener('click', close);

  // Tab Switcher Logic
  const tabProject = modal.querySelector('#tab-project');
  const tabHello = modal.querySelector('#tab-hello');
  const projectTypeField = modal.querySelector('#project-type-field');
  const sheetTitle = modal.querySelector('#sheet-title');
  const sheetSub = modal.querySelector('#sheet-sub');
  const submitBtnSpan = modal.querySelector('#sheet-submit span');

  tabProject.addEventListener('click', () => {
    tabProject.classList.add('active');
    tabHello.classList.remove('active');
    if (projectTypeField) projectTypeField.style.display = 'block';
    if (sheetTitle) sheetTitle.innerHTML = 'Let’s build something <em>together.</em>';
    if (sheetSub) sheetSub.textContent = 'Tell me about your project, timeline, or scope.';
    if (submitBtnSpan) submitBtnSpan.textContent = 'Send Proposal';
  });

  tabHello.addEventListener('click', () => {
    tabHello.classList.add('active');
    tabProject.classList.remove('active');
    if (projectTypeField) projectTypeField.style.display = 'none';
    if (sheetTitle) sheetTitle.innerHTML = 'Say hello or <em>drop a line.</em>';
    if (sheetSub) sheetSub.textContent = 'Always open to connect, share ideas, or chat.';
    if (submitBtnSpan) submitBtnSpan.textContent = 'Send Greeting';
  });

  const form = modal.querySelector('#sheet-form');
  const successState = modal.querySelector('#sheet-success');
  const doneBtn = modal.querySelector('#sheet-done-btn');

  if (doneBtn) doneBtn.addEventListener('click', close);

  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const submitBtn = form.querySelector('#sheet-submit');
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const projectType = tabProject.classList.contains('active') ? form.querySelector('[name="projectType"]').value : 'General Inquiry';
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        if (submitBtnSpan) submitBtnSpan.textContent = 'Sending...';
      }

      const newMsg = {
        id: Date.now().toString(),
        name,
        email,
        projectType,
        message,
        createdAt: new Date().toISOString()
      };

      // 1. Save directly to local storage instantly so Admin Panel & UI have it in <10ms
      try {
        const existing = JSON.parse(localStorage.getItem('ak_submitted_messages') || '[]');
        existing.unshift(newMsg);
        localStorage.setItem('ak_submitted_messages', JSON.stringify(existing));
      } catch (e) {}

      // 2. Fire-and-forget background network submission (does NOT delay UI)
      (async () => {
        try {
          await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMsg)
          });
        } catch (err) {}

        const recipientMail = localStorage.getItem('ak_notification_email') || 'abikrishna15@gmail.com';
        const formSubmitEndpoint = (recipientMail.includes('abikrishna') || !recipientMail)
          ? 'https://formsubmit.co/ajax/45f0be24b864aae1adf768d96a06bd00'
          : `https://formsubmit.co/ajax/${encodeURIComponent(recipientMail)}`;

        try {
          await fetch(formSubmitEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              _subject: `New Portfolio Inquiry: ${projectType} from ${name}`,
              name,
              email,
              projectType,
              submittedAt: new Date().toLocaleString(),
              message
            })
          });
        } catch (e) {}
      })();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        if (submitBtnSpan) submitBtnSpan.textContent = tabProject.classList.contains('active') ? 'Send Proposal' : 'Send Greeting';
      }

      form.reset();
      form.style.display = 'none';

      // 3. Render Clean Success View
      if (successState) {
        successState.innerHTML = `
          <div style="text-align:center; padding:20px 0; width:100%;">
            <div style="width:56px; height:56px; background:#eef7f2; color:#1e7e48; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:16px;">✓</div>
            <h3 style="font-size:22px; font-weight:800; margin:0 0 8px; color:#111;">Inquiry Received!</h3>
            <p style="color:#666; font-size:14px; margin:0 0 24px; line-height:1.5;">Thank you for reaching out. I’ll review your message and get back to you soon.</p>
            <button type="button" id="sheet-done-btn" style="padding:14px 32px; background:#111; color:#fff; border:0; border-radius:12px; font-weight:700; font-size:14px; cursor:pointer; min-width:140px;">
              Done
            </button>
          </div>
        `;
        successState.style.display = 'flex';
        const newDoneBtn = successState.querySelector('#sheet-done-btn');
        if (newDoneBtn) newDoneBtn.addEventListener('click', close);
      }
    });
  }
})();

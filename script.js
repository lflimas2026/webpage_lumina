document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. Sticky Header scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Navigation Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle menu icon between burger and cross
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        // Close mobile menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // 3. Simulated Drag & Drop Calendar
    const appointments = document.querySelectorAll('.appointment-card');
    const slots = document.querySelectorAll('.calendar-slot');
    let draggedItem = null;

    appointments.forEach(app => {
        app.addEventListener('dragstart', (e) => {
            draggedItem = app;
            app.classList.add('dragging');
            
            // Set drag data for safety
            e.dataTransfer.setData('text/plain', app.id);
            
            // Highlight potential drop targets
            slots.forEach(slot => {
                if (slot !== app.parentNode) {
                    slot.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
                    slot.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                }
            });
        });

        app.addEventListener('dragend', () => {
            app.classList.remove('dragging');
            draggedItem = null;
            
            // Remove highlight from drop targets
            slots.forEach(slot => {
                slot.style.backgroundColor = '';
                slot.style.borderColor = '';
            });
        });

        // Mobile touch click-to-move alternative
        app.addEventListener('click', () => {
            const dropTarget = document.getElementById('drop-target-slot');
            if (dropTarget && app.id === 'apt-2' && app.parentNode !== dropTarget) {
                // Remove the drop zone indicator if present
                const indicator = dropTarget.querySelector('.drop-zone-indicator');
                if (indicator) indicator.remove();
                
                // Move appointment
                dropTarget.appendChild(app);
                
                // Visual feedback
                app.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    app.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow dropping
            if (slot !== draggedItem.parentNode) {
                slot.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                slot.style.borderColor = 'var(--success)';
            }
        });

        slot.addEventListener('dragleave', () => {
            slot.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
            slot.style.borderColor = 'rgba(99, 102, 241, 0.2)';
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem && slot !== draggedItem.parentNode) {
                // If it has indicator, remove it
                const indicator = slot.querySelector('.drop-zone-indicator');
                if (indicator) {
                    indicator.remove();
                }
                
                // Append card to slot
                slot.appendChild(draggedItem);
            }
        });
    });

    // 4. Interactive Before/After Slider
    const sliderContainer = document.getElementById('slider-container');
    const afterImage = document.getElementById('after-image');
    const sliderHandle = document.getElementById('slider-handle');

    if (sliderContainer && afterImage && sliderHandle) {
        let isSliding = false;

        const slide = (x) => {
            const rect = sliderContainer.getBoundingClientRect();
            // Calculate percentage from left side of container
            let percentage = ((x - rect.left) / rect.width) * 100;
            
            // Limit bounds [0%, 100%]
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            // Apply widths and positions
            afterImage.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        };

        const onStart = () => {
            isSliding = true;
        };

        const onEnd = () => {
            isSliding = false;
        };

        const onMove = (e) => {
            if (!isSliding) return;
            // Support mouse and touch events
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            slide(clientX);
        };

        // Event listeners for desktop mouse
        sliderHandle.addEventListener('mousedown', onStart);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('mousemove', onMove);

        // Event listeners for mobile touch
        sliderHandle.addEventListener('touchstart', onStart);
        window.addEventListener('touchend', onEnd);
        window.addEventListener('touchmove', onMove);

        // Allow clicking anywhere on the slider container to move the slider
        sliderContainer.addEventListener('click', (e) => {
            if (e.target !== sliderHandle && !sliderHandle.contains(e.target)) {
                slide(e.clientX);
            }
        });
    }

    // 5. Interactive Role Permissions Selector
    const roleButtons = document.querySelectorAll('.role-btn');
    const permissionItems = document.querySelectorAll('.permission-item');
    const roleDescText = document.getElementById('role-desc-text');

    const roleDescriptions = {
        admin: '<strong>Acesso Administrador:</strong> Permissão total sobre todas as áreas, incluindo relatórios de faturamento, alteração de permissões, gestão de equipe e configurações fiscais.',
        profissional: '<strong>Acesso Profissional:</strong> Acesso à agenda pessoal, preenchimento de prontuários eletrônicos de pacientes, upload de fotos e visualização de comissões próprias.',
        recepcao: '<strong>Acesso Recepção:</strong> Permissão para realizar agendamentos, remarcações, confirmar presença via WhatsApp e cadastrar pacientes. Acesso restrito a relatórios financeiros e fichas clínicas médicas.'
    };

    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedRole = button.getAttribute('data-role');
            
            // Update active button state
            roleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update permission checkboxes based on role permissions
            permissionItems.forEach(item => {
                const allowedRoles = item.getAttribute('data-roles').split(',');
                if (allowedRoles.includes(selectedRole)) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Update description text
            if (roleDescText && roleDescriptions[selectedRole]) {
                roleDescText.innerHTML = roleDescriptions[selectedRole];
            }
        });
    });

    // 6. Interactive Pricing Toggle (Monthly vs Annual)
    const billingToggle = document.getElementById('billingToggle');
    const labelMonthly = document.getElementById('label-monthly');
    const labelYearly = document.getElementById('label-yearly');
    
    // Plan prices elements
    const priceLight = document.getElementById('price-light');
    const pricePro = document.getElementById('price-pro');
    const pricePremium = document.getElementById('price-premium');
    
    // Plan periods elements
    const periods = [
        document.getElementById('period-light'),
        document.getElementById('period-pro'),
        document.getElementById('period-premium')
    ];

    const savingPro = document.getElementById('saving-pro');

    if (billingToggle) {
        billingToggle.addEventListener('click', () => {
            billingToggle.classList.toggle('yearly');
            
            const isYearly = billingToggle.classList.contains('yearly');
            
            // Update cycle labels styles
            if (isYearly) {
                labelYearly.classList.add('text-active');
                labelMonthly.classList.remove('text-active');
                if (savingPro) savingPro.classList.add('show');
            } else {
                labelMonthly.classList.add('text-active');
                labelYearly.classList.remove('text-active');
                if (savingPro) savingPro.classList.remove('show');
            }

            // Helper to update individual card pricing
            const updatePrice = (priceEl) => {
                if (priceEl) {
                    const monthlyVal = priceEl.getAttribute('data-monthly');
                    const yearlyVal = priceEl.getAttribute('data-yearly');
                    
                    // Format monthly or annual price tag
                    const valToSet = isYearly ? yearlyVal : monthlyVal;
                    
                    // Trigger simple scale transition on price change
                    priceEl.style.transform = 'scale(0.85)';
                    priceEl.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        priceEl.textContent = parseFloat(valToSet).toLocaleString('pt-BR');
                        priceEl.style.transform = 'scale(1)';
                        priceEl.style.opacity = '1';
                    }, 150);
                }
            };

            // Update all price elements
            updatePrice(priceLight);
            updatePrice(pricePro);
            updatePrice(pricePremium);

            // Update periods
            periods.forEach(p => {
                if (p) {
                    p.textContent = isYearly ? '/mês (cobrado anualmente)' : '/mês';
                }
            });
        });
    }

    // 7. Animated Numbers (Intersection Observer)
    const animateValue = (id, start, end, duration, prefix = '', suffix = '') => {
        const obj = document.getElementById(id);
        if (!obj) return;
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const val = Math.floor(progress * (end - start) + start);
            
            // Format number as Brazilian Real or percentage
            let formattedVal = val.toLocaleString('pt-BR');
            obj.innerHTML = prefix + formattedVal + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger counters when dashboard enters view
                animateValue('kpi-today', 0, 1840, 1200, 'R$ ', ',00');
                animateValue('kpi-month', 0, 42690, 1500, 'R$ ', ',00');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const financeMockup = document.querySelector('.finance-mockup');
    if (financeMockup) {
        countObserver.observe(financeMockup);
    }
});

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {

// User Menu Dropdown Functionality
(function() {
    const userMenu = document.querySelector('.user-menu');
    const userMenuTrigger = document.querySelector('.user-menu__trigger');
    const userMenuDropdown = document.querySelector('.user-menu__dropdown');
    const userMenuItems = document.querySelectorAll('.user-menu__dropdown-item');

    if (!userMenu || !userMenuTrigger || !userMenuDropdown) {
        console.warn('User menu elements not found');
        return;
    }

    let isOpen = false;

    // Toggle dropdown
    function toggleDropdown() {
        isOpen = !isOpen;
        
        if (isOpen) {
            openDropdown();
        } else {
            closeDropdown();
        }
    }

    // Open dropdown
    function openDropdown() {
        isOpen = true;
        userMenuDropdown.hidden = false;
        userMenuTrigger.setAttribute('aria-expanded', 'true');
        userMenu.setAttribute('aria-expanded', 'true');
        
        // Focus first menu item
        const firstItem = userMenuDropdown.querySelector('.user-menu__dropdown-item');
        if (firstItem) {
            firstItem.focus();
        }
    }

    // Close dropdown
    function closeDropdown() {
        isOpen = false;
        userMenuDropdown.hidden = true;
        userMenuTrigger.setAttribute('aria-expanded', 'false');
        userMenu.setAttribute('aria-expanded', 'false');
    }

    // Handle menu item actions
    function handleMenuItemClick(event) {
        event.preventDefault();
        const item = event.currentTarget;
        const text = item.textContent.trim();
        
        // Close dropdown
        closeDropdown();
        
        // Handle different menu actions
        switch (text) {
            case 'Profile Settings':
                console.log('Navigate to profile settings');
                // Add navigation logic here
                break;
            case 'Account Preferences':
                console.log('Navigate to account preferences');
                // Add navigation logic here
                break;
            case 'Notifications':
                console.log('Navigate to notifications');
                // Add navigation logic here
                break;
            case 'Help & Support':
                console.log('Navigate to help & support');
                // Add navigation logic here
                break;
            case 'Sign Out':
                console.log('Sign out user');
                // Add sign out logic here
                if (confirm('Are you sure you want to sign out?')) {
                    // Implement sign out functionality
                    alert('Sign out functionality would be implemented here');
                }
                break;
            default:
                console.log('Unknown menu item:', text);
        }
    }

    // Keyboard navigation
    function handleKeyNavigation(event) {
        if (!isOpen) return;

        const items = Array.from(userMenuItems);
        const currentIndex = items.indexOf(document.activeElement);

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                closeDropdown();
                userMenuTrigger.focus();
                break;
            case 'ArrowDown':
                event.preventDefault();
                const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                items[nextIndex].focus();
                break;
            case 'ArrowUp':
                event.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                items[prevIndex].focus();
                break;
            case 'Home':
                event.preventDefault();
                items[0].focus();
                break;
            case 'End':
                event.preventDefault();
                items[items.length - 1].focus();
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (document.activeElement.classList.contains('user-menu__dropdown-item')) {
                    handleMenuItemClick(event);
                }
                break;
        }
    }

    // Click outside to close
    function handleDocumentClick(event) {
        if (!userMenu.contains(event.target) && isOpen) {
            closeDropdown();
        }
    }

    // Event listeners
    userMenuTrigger.addEventListener('click', toggleDropdown);
    
    // Add click handlers to menu items
    userMenuItems.forEach(item => {
        item.addEventListener('click', handleMenuItemClick);
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);

    // Click outside to close
    document.addEventListener('click', handleDocumentClick);

    // Prevent clicks inside dropdown from closing it
    userMenuDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
    });
})();

// Navigation functionality
(function () {
    const navLinks = Array.from(document.querySelectorAll('.sidebar__link'));
    const sections = Array.from(document.querySelectorAll('.section'));

    function activateSection(targetId) {
        sections.forEach((section) => {
            const isActive = section.id === targetId;
            section.classList.toggle('section--active', isActive);
            section.setAttribute('aria-hidden', (!isActive).toString());
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.dataset.target;
            if (!targetId) return;

            navLinks.forEach((navItem) => {
                navItem.classList.toggle('sidebar__link--active', navItem === link);
            });

            activateSection(targetId);
        });
    });

    const defaultTarget = navLinks.find((link) => link.classList.contains('sidebar__link--active'))?.dataset.target;
    if (defaultTarget) {
        activateSection(defaultTarget);
    }
})();

// Forecast chart setup
(function() {
    const forecastCanvas = document.getElementById('forecastChart');
    if (forecastCanvas && window.Chart) {
        const forecastCard = forecastCanvas.closest('.analytics-card');
        const rangeButtons = Array.from(forecastCard.querySelectorAll('[data-range]'));
        const chartContext = forecastCanvas.getContext('2d');

        const chartRanges = {
            week: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                values: [12.2, 11.6, 13.5, 14.8, 16.1, 15.4, 13.8]
            },
            month: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                values: [54.5, 61.2, 58.3, 65.4]
            },
            quarter: {
                labels: ['July', 'August', 'September'],
                values: [180.3, 194.6, 208.1]
            }
        };

        const barColors = {
            background: 'rgba(37, 99, 235, 0.75)',
            hover: 'rgba(37, 99, 235, 0.9)',
            border: 'rgba(37, 99, 235, 1)'
        };

        let currentRange = rangeButtons.find(btn => btn.classList.contains('analytics-card__action--active'))?.dataset.range || 'month';

        const buildDataset = (rangeKey) => ({
            labels: chartRanges[rangeKey].labels,
            datasets: [
                {
                    label: 'Projected Revenue (NGN)',
                    data: chartRanges[rangeKey].values,
                    backgroundColor: barColors.background,
                    hoverBackgroundColor: barColors.hover,
                    borderRadius: 8,
                    maxBarThickness: 48
                }
            ]
        });

        const forecastChart = new Chart(chartContext, {
            type: 'bar',
            data: buildDataset(currentRange),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            color: 'var(--color-gray-500)',
                            font: {
                                family: 'Inter'
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'var(--color-gray-500)',
                            font: {
                                family: 'Inter'
                            },
                            callback: (value) => `${value}M`
                        },
                        border: {
                            display: false
                        },
                        grid: {
                            color: 'rgba(17, 24, 39, 0.08)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `NGN ${context.parsed.y.toFixed(1)}M`
                        }
                    }
                }
            }
        });

        rangeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const targetRange = button.dataset.range;
                if (!targetRange || targetRange === currentRange) return;

                rangeButtons.forEach((btn) => {
                    btn.classList.toggle('analytics-card__action--active', btn === button);
                });

                currentRange = targetRange;
                const updated = buildDataset(currentRange);
                forecastChart.data.labels = updated.labels;
                forecastChart.data.datasets[0].data = updated.datasets[0].data;
                forecastChart.update();
            });
        });

        const resizeObserver = new ResizeObserver(() => forecastChart.resize());
        resizeObserver.observe(forecastCanvas);
    }
})();


// Lead sources chart setup
(function() {
    const leadSourcesCanvas = document.getElementById('leadSourcesChart');
    if (!leadSourcesCanvas || !window.Chart) {
        return;
    }

    const legendItems = Array.from(document.querySelectorAll('.lead-sources__legend li'));
    if (!legendItems.length) {
        return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const resolveColor = (variableName, fallback) => {
        const value = rootStyles.getPropertyValue(variableName);
        return value && value.trim() ? value.trim() : fallback;
    };

    const fallbackPalette = [
        resolveColor('--color-primary', '#2563eb'),
        resolveColor('--color-success', '#10b981'),
        resolveColor('--color-warning', '#f59e0b'),
        resolveColor('--color-primary-light', '#3b82f6'),
        resolveColor('--color-error-light', '#f87171')
    ];

    const sources = legendItems.map((item, index) => {
        const label = item.dataset.label?.trim() || item.querySelector('.lead-sources__label')?.textContent.trim() || `Source ${index + 1}`;
        const rawValue = item.dataset.value ?? item.querySelector('.lead-sources__value')?.textContent.replace('%', '').trim();
        const numericValue = Number.parseFloat(rawValue || '0');
        const value = Number.isFinite(numericValue) ? numericValue : 0;
        const dot = item.querySelector('.lead-sources__dot');
        let color = dot ? getComputedStyle(dot).backgroundColor : '';

        if (!color || color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
            color = fallbackPalette[index % fallbackPalette.length];
        }

        item.setAttribute('aria-pressed', 'false');
        const valueElement = item.querySelector('.lead-sources__value');
        if (valueElement) {
            valueElement.textContent = `${value}%`;
        }

        return { label, value, color };
    });

    const labels = sources.map((source) => source.label);
    const values = sources.map((source) => source.value);
    const colors = sources.map((source) => source.color);

    const leadSourcesChart = new Chart(leadSourcesCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: colors,
                    hoverOffset: 8,
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            animation: {
                duration: 700
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: ${context.raw}%`
                    }
                }
            }
        }
    });

    const setActiveSegment = (index) => {
        if (typeof index === 'number') {
            leadSourcesChart.setActiveElements([{ datasetIndex: 0, index }]);
        } else {
            leadSourcesChart.setActiveElements([]);
        }

        leadSourcesChart.update('none');

        legendItems.forEach((item, itemIndex) => {
            const isActive = itemIndex === index;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    legendItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => setActiveSegment(index));
        item.addEventListener('mouseleave', () => setActiveSegment());
        item.addEventListener('focus', () => setActiveSegment(index));
        item.addEventListener('blur', () => setActiveSegment());
        item.addEventListener('click', () => setActiveSegment(index));
        item.addEventListener('touchstart', () => setActiveSegment(index), { passive: true });
        item.addEventListener('touchend', () => setActiveSegment(), { passive: true });
        item.addEventListener('touchcancel', () => setActiveSegment(), { passive: true });
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setActiveSegment(index);
            }
        });
    });

    const resizeObserver = new ResizeObserver(() => leadSourcesChart.resize());
    resizeObserver.observe(leadSourcesCanvas);
})();

// Add Listing Modal functionality
(function() {
    const addListingBtn = document.getElementById('add-listing-btn');
    const modal = document.getElementById('add-listing-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const backdrop = modal?.querySelector('.modal__backdrop');
    const nextStepBtn = document.getElementById('next-step');
    const prevStepBtn = document.getElementById('prev-step');
    const submitBtn = document.getElementById('submit-listing');
    const steps = modal?.querySelectorAll('.add-listing-modal__step');
    const formSteps = modal?.querySelectorAll('.add-listing-modal__form-step');
    
    if (!modal) return;
    
    let currentStep = 1;
    const totalSteps = 3;

    function openModal() {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Reset form and step
        currentStep = 1;
        updateStep();
        modal.querySelector('.add-listing-form')?.reset();
    }

    function updateStep() {
        // Update step indicators
        steps?.forEach((step, index) => {
            step.classList.remove('add-listing-modal__step--active', 'add-listing-modal__step--completed');
            if (index + 1 === currentStep) {
                step.classList.add('add-listing-modal__step--active');
            } else if (index + 1 < currentStep) {
                step.classList.add('add-listing-modal__step--completed');
            }
        });

        // Update form steps
        formSteps?.forEach((formStep, index) => {
            formStep.classList.remove('add-listing-modal__form-step--active');
            if (index + 1 === currentStep) {
                formStep.classList.add('add-listing-modal__form-step--active');
            }
        });

        // Update buttons
        if (prevStepBtn) prevStepBtn.style.display = currentStep === 1 ? 'none' : 'block';
        if (nextStepBtn) nextStepBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
        if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    }

    function nextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep();
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateStep();
        }
    }

    // Event listeners
    addListingBtn?.addEventListener('click', openModal);
    closeModalBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    nextStepBtn?.addEventListener('click', nextStep);
    prevStepBtn?.addEventListener('click', prevStep);
    
    // Add event listener for X close button
    const addModalCloseBtn = document.getElementById('add-modal-close');
    addModalCloseBtn?.addEventListener('click', closeModal);

    // Handle form submission
    modal.querySelector('.add-listing-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const listingData = Object.fromEntries(formData.entries());
        
        // Show success message (in a real app, this would submit to a server)
        const isPublished = listingData.status === 'published';
        showSuccessModal('created', isPublished);
        
        closeModal();
    });
})();

// Edit Listing Modal functionality
(function() {
    const editModal = document.getElementById('edit-listing-modal');
    const editCloseModalBtn = document.getElementById('edit-close-modal');
    const editBackdrop = editModal?.querySelector('.modal__backdrop');
    const editNextStepBtn = document.getElementById('edit-next-step');
    const editPrevStepBtn = document.getElementById('edit-prev-step');
    const editSubmitBtn = document.getElementById('edit-submit-listing');
    const editSteps = editModal?.querySelectorAll('.add-listing-modal__step');
    const editFormSteps = editModal?.querySelectorAll('.add-listing-modal__form-step');
    
    if (!editModal) return;
    
    let editCurrentStep = 1;
    const editTotalSteps = 3;
    let currentEditingListingId = null;

    function openEditModal(listingData) {
        editModal.style.display = 'flex';
        editModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Populate form with listing data
        populateEditForm(listingData);
        
        // Reset to first step
        editCurrentStep = 1;
        updateEditStep();
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        editModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Reset form and step
        editCurrentStep = 1;
        updateEditStep();
        editModal.querySelector('.edit-listing-form')?.reset();
        currentEditingListingId = null;
    }

    function updateEditStep() {
        // Update step indicators
        editSteps?.forEach((step, index) => {
            step.classList.remove('add-listing-modal__step--active', 'add-listing-modal__step--completed');
            if (index + 1 === editCurrentStep) {
                step.classList.add('add-listing-modal__step--active');
            } else if (index + 1 < editCurrentStep) {
                step.classList.add('add-listing-modal__step--completed');
            }
        });

        // Update form steps
        editFormSteps?.forEach((formStep, index) => {
            formStep.classList.remove('add-listing-modal__form-step--active');
            if (index + 1 === editCurrentStep) {
                formStep.classList.add('add-listing-modal__form-step--active');
            }
        });

        // Update buttons
        if (editPrevStepBtn) editPrevStepBtn.style.display = editCurrentStep === 1 ? 'none' : 'block';
        if (editNextStepBtn) editNextStepBtn.style.display = editCurrentStep === editTotalSteps ? 'none' : 'block';
        if (editSubmitBtn) editSubmitBtn.style.display = editCurrentStep === editTotalSteps ? 'block' : 'none';
    }

    function editNextStep() {
        if (editCurrentStep < editTotalSteps) {
            editCurrentStep++;
            updateEditStep();
        }
    }

    function editPrevStep() {
        if (editCurrentStep > 1) {
            editCurrentStep--;
            updateEditStep();
        }
    }

    function populateEditForm(listingData) {
        // Store the listing ID
        currentEditingListingId = listingData.id;
        document.getElementById('edit-listing-id').value = listingData.id;
        
        // Populate basic fields
        document.getElementById('edit-property-name').value = listingData.name || '';
        document.getElementById('edit-description').value = listingData.description || '';
        document.getElementById('edit-address').value = listingData.address || '';
        document.getElementById('edit-city').value = listingData.city || '';
        
        // Set select values
        const editBedroomsSelect = document.getElementById('edit-bedrooms');
        const editBathroomsSelect = document.getElementById('edit-bathrooms');
        const editStateSelect = document.getElementById('edit-state');
        
        if (editBedroomsSelect && listingData.bedrooms) {
            editBedroomsSelect.value = listingData.bedrooms;
        }
        if (editBathroomsSelect && listingData.bathrooms) {
            editBathroomsSelect.value = listingData.bathrooms;
        }
        if (editStateSelect && listingData.state) {
            editStateSelect.value = listingData.state;
        }
        
        // Set property type radio
        if (listingData.type) {
            const propertyTypeRadio = document.querySelector(`input[name="edit-property-type"][value="${listingData.type}"]`);
            if (propertyTypeRadio) {
                propertyTypeRadio.checked = true;
                // Trigger the radio group styling update
                const radioGroupOption = propertyTypeRadio.closest('.radio-group__option');
                if (radioGroupOption) {
                    document.querySelectorAll('#edit-listing-modal .radio-group__option').forEach(option => {
                        option.classList.remove('radio-group__option--selected');
                    });
                    radioGroupOption.classList.add('radio-group__option--selected');
                }
            }
        }
        
        // Set pricing
        document.getElementById('edit-rent-amount').value = listingData.rent || '';
        document.getElementById('edit-security-deposit').value = listingData.deposit || '';
        
        // Set status radio
        if (listingData.status) {
            const statusRadio = document.querySelector(`input[name="edit-status"][value="${listingData.status}"]`);
            if (statusRadio) {
                statusRadio.checked = true;
                // Trigger the radio group styling update
                const radioGroupOption = statusRadio.closest('.radio-group__option');
                if (radioGroupOption) {
                    document.querySelectorAll('#edit-listing-modal .radio-group__option').forEach(option => {
                        option.classList.remove('radio-group__option--selected');
                    });
                    radioGroupOption.classList.add('radio-group__option--selected');
                }
            }
        }
        
        // Set amenities checkboxes
        if (listingData.amenities && Array.isArray(listingData.amenities)) {
            listingData.amenities.forEach(amenity => {
                const checkbox = document.querySelector(`input[name="edit-amenities"][value="${amenity}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }

    function extractListingDataFromCard(listingCard) {
        // Extract data from the listing card DOM elements
        const title = listingCard.querySelector('.listing-card__title')?.textContent.trim() || '';
        const location = listingCard.querySelector('.listing-card__location')?.textContent.trim() || '';
        const type = listingCard.querySelector('.listing-card__badge:not(.listing-card__badge--status)')?.textContent.trim() || '';
        const status = listingCard.dataset.status || 'active';
        const rentText = listingCard.querySelector('.listing-card__meta-value')?.textContent.trim() || '';
        
        // Parse rent amount (remove currency symbols and extract number)
        const rentMatch = rentText.match(/[\d,]+/);
        const rent = rentMatch ? rentMatch[0].replace(',', '') : '';
        
        // Parse property details for bedrooms/bathrooms
        const detailsText = listingCard.querySelectorAll('.listing-card__meta-value')[1]?.textContent || '';
        const bedroomMatch = detailsText.match(/(\d+)BR/);
        const bathroomMatch = detailsText.match(/(\d+)BA/);
        
        // Extract city from location
        const locationParts = location.split(',');
        const city = locationParts.length > 1 ? locationParts[1].trim() : locationParts[0];
        
        return {
            id: listingCard.dataset.listingId || Date.now().toString(),
            name: title,
            type: type,
            bedrooms: bedroomMatch ? bedroomMatch[1] : '',
            bathrooms: bathroomMatch ? bathroomMatch[1] : '',
            description: '',
            address: location,
            city: city,
            state: 'Harare', // Default to Harare, could be extracted from location
            rent: rent,
            deposit: '',
            status: status === 'active' ? 'published' : 'draft',
            amenities: [] // Could be extracted if available in the card
        };
    }

    // Event listeners
    editCloseModalBtn?.addEventListener('click', closeEditModal);
    editBackdrop?.addEventListener('click', closeEditModal);
    editNextStepBtn?.addEventListener('click', editNextStep);
    editPrevStepBtn?.addEventListener('click', editPrevStep);
    
    // Add event listener for X close button
    const editModalCloseBtn = document.getElementById('edit-modal-close');
    editModalCloseBtn?.addEventListener('click', closeEditModal);

    // Handle form submission
    editModal.querySelector('.edit-listing-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const listingData = Object.fromEntries(formData.entries());
        
        // Update the original listing card with new data
        updateListingCard(currentEditingListingId, listingData);
        
        // Show success message
        const isPublished = listingData['edit-status'] === 'published';
        showSuccessModal('updated', isPublished);
        
        closeEditModal();
    });

    function updateListingCard(listingId, formData) {
        // Find the listing card and update its content
        const listingCards = document.querySelectorAll('.listing-card');
        const targetCard = Array.from(listingCards).find(card => 
            card.dataset.listingId === listingId || 
            card.querySelector('.listing-card__title')?.textContent.trim() === formData['edit-property-name']
        );
        
        if (targetCard) {
            // Update title
            const titleElement = targetCard.querySelector('.listing-card__title');
            if (titleElement) titleElement.textContent = formData['edit-property-name'];
            
            // Update location
            const locationElement = targetCard.querySelector('.listing-card__location');
            if (locationElement) locationElement.textContent = `${formData['edit-address']}, ${formData['edit-city']}`;
            
            // Update rent
            const rentElement = targetCard.querySelector('.listing-card__meta-value');
            if (rentElement && formData['edit-rent-amount']) {
                rentElement.textContent = `$${parseInt(formData['edit-rent-amount']).toLocaleString()}`;
            }
            
            // Update property details
            const detailsElement = targetCard.querySelectorAll('.listing-card__meta-value')[1];
            if (detailsElement && formData['edit-bedrooms'] && formData['edit-bathrooms']) {
                detailsElement.textContent = `${formData['edit-bedrooms']}BR • ${formData['edit-bathrooms']}BA • Furnished`;
            }
            
            // Update type badge
            const typeBadge = targetCard.querySelector('.listing-card__badge:not(.listing-card__badge--status)');
            if (typeBadge) typeBadge.textContent = formData['edit-property-type'];
            
            // Update status
            const statusBadge = targetCard.querySelector('.listing-card__badge--status');
            if (statusBadge) {
                statusBadge.textContent = formData['edit-status'] === 'published' ? 'Active' : 'Draft';
            }
            
            // Update dataset
            targetCard.dataset.category = formData['edit-property-type'];
            targetCard.dataset.status = formData['edit-status'] === 'published' ? 'active' : 'draft';
            targetCard.dataset.listingId = listingId;
        }
    }

    // Expose function to be called by edit buttons
    window.openEditListingModal = function(listingCard) {
        const listingData = extractListingDataFromCard(listingCard);
        openEditModal(listingData);
    };
})();

// Spotlight Search functionality
(function() {
    const spotlightTrigger = document.getElementById('spotlight-trigger');
    const spotlightModal = document.getElementById('spotlight-modal');
    const spotlightInput = document.getElementById('spotlight-search-input');
    const spotlightClose = document.getElementById('spotlight-close');
    const spotlightResults = document.getElementById('spotlight-results');
    const spotlightEmpty = document.getElementById('spotlight-empty');
    const spotlightNoResults = document.getElementById('spotlight-no-results');
    const spotlightResultsList = document.getElementById('spotlight-results-list');
    const spotlightRecents = document.getElementById('spotlight-recents');
    const spotlightRecentsList = document.getElementById('spotlight-recents-list');
    const spotlightClearRecents = document.getElementById('spotlight-clear-recents');

    if (!spotlightModal) return;

    // Property data extracted from the DOM
    const properties = Array.from(document.querySelectorAll('.listing-card')).map((card, index) => ({
        id: index + 1,
        title: card.querySelector('.listing-card__title')?.textContent.trim() || '',
        location: card.querySelector('.listing-card__location')?.textContent.trim() || '',
        type: card.dataset.category || '',
        status: card.dataset.status || 'active',
        price: card.querySelector('.listing-card__meta-value')?.textContent.trim() || '',
        element: card
    }));

    let currentQuery = '';
    let activeResultIndex = -1;
    let searchResults = [];
    let recentSearches = JSON.parse(localStorage.getItem('spotlight-recent-searches') || '[]');

    // Utility functions
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function getPropertyIcon(type) {
        const icons = {
            'Luxury Apartments': 'LA',
            'Business Suites': 'BS',
            'Family Homes': 'FH',
            'Country Estates': 'CE'
        };
        return icons[type] || type.charAt(0).toUpperCase();
    }

    function saveRecentSearch(query) {
        if (!query.trim() || recentSearches.includes(query)) return;
        
        recentSearches.unshift(query);
        recentSearches = recentSearches.slice(0, 5); // Keep only 5 recent searches
        localStorage.setItem('spotlight-recent-searches', JSON.stringify(recentSearches));
        renderRecentSearches();
    }

    function removeRecentSearch(query) {
        recentSearches = recentSearches.filter(search => search !== query);
        localStorage.setItem('spotlight-recent-searches', JSON.stringify(recentSearches));
        renderRecentSearches();
    }

    function clearRecentSearches() {
        recentSearches = [];
        localStorage.removeItem('spotlight-recent-searches');
        renderRecentSearches();
    }

    // Modal functions
    function openSpotlight() {
        spotlightModal.style.display = 'flex';
        spotlightModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        spotlightInput?.focus();
        showDefaultState();
    }

    function closeSpotlight() {
        spotlightModal.style.display = 'none';
        spotlightModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (spotlightInput) spotlightInput.value = '';
        currentQuery = '';
        activeResultIndex = -1;
        showDefaultState();
    }

    function showDefaultState() {
        if (spotlightEmpty) spotlightEmpty.style.display = 'block';
        if (spotlightNoResults) spotlightNoResults.style.display = 'none';
        if (spotlightResultsList) spotlightResultsList.style.display = 'none';
        if (spotlightRecents) spotlightRecents.style.display = recentSearches.length > 0 ? 'block' : 'none';
    }

    function showResults() {
        if (spotlightEmpty) spotlightEmpty.style.display = 'none';
        if (spotlightRecents) spotlightRecents.style.display = 'none';
        
        if (searchResults.length > 0) {
            if (spotlightNoResults) spotlightNoResults.style.display = 'none';
            if (spotlightResultsList) spotlightResultsList.style.display = 'block';
        } else {
            if (spotlightNoResults) spotlightNoResults.style.display = 'block';
            if (spotlightResultsList) spotlightResultsList.style.display = 'none';
        }
    }

    // Search functions
    function performSearch(query) {
        if (!query.trim()) {
            showDefaultState();
            return;
        }

        currentQuery = query.toLowerCase();
        searchResults = properties.filter(property => {
            return property.title.toLowerCase().includes(currentQuery) ||
                   property.location.toLowerCase().includes(currentQuery) ||
                   property.type.toLowerCase().includes(currentQuery);
        });

        renderResults();
        showResults();
        activeResultIndex = -1;
    }

    function renderResults() {
        if (!spotlightResultsList) return;
        
        spotlightResultsList.innerHTML = searchResults.map((property, index) => `
            <div class="spotlight-result" data-index="${index}" data-property-id="${property.id}">
                <div class="spotlight-result__icon">
                    ${getPropertyIcon(property.type)}
                </div>
                <div class="spotlight-result__content">
                    <h4 class="spotlight-result__title">
                        ${highlightText(property.title, currentQuery)}
                    </h4>
                    <p class="spotlight-result__subtitle">
                        ${highlightText(property.location, currentQuery)}
                    </p>
                    <div class="spotlight-result__meta">
                        <span class="spotlight-result__badge">${property.type}</span>
                        <span>•</span>
                        <span>${property.price}</span>
                        <span>•</span>
                        <span class="status-${property.status}">${property.status.charAt(0).toUpperCase() + property.status.slice(1)}</span>
                    </div>
                </div>
                <button class="spotlight-result__action" aria-label="View property">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    function renderRecentSearches() {
        if (!spotlightRecentsList) return;
        
        if (recentSearches.length === 0) {
            if (spotlightRecents) spotlightRecents.style.display = 'none';
            return;
        }

        spotlightRecentsList.innerHTML = recentSearches.map(search => `
            <div class="spotlight-recents__item" data-search="${search}">
                <span class="spotlight-recents__item__text">${search}</span>
                <button class="spotlight-recents__item__remove" data-search="${search}" aria-label="Remove recent search">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    function selectResult(index) {
        if (index < 0 || index >= searchResults.length) return;
        
        const property = searchResults[index];
        saveRecentSearch(currentQuery);
        
        // Scroll to the property card in the main view
        if (property.element) {
            // First make sure we're on the listings page
            const listingsLink = document.querySelector('[data-target="listings"]');
            if (listingsLink) {
                listingsLink.click();
                
                // Wait for the section to be visible, then scroll
                setTimeout(() => {
                    property.element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Add a highlight effect
                    property.element.style.transform = 'scale(1.02)';
                    property.element.style.boxShadow = '0 20px 25px -5px rgba(37, 99, 235, 0.2), 0 8px 10px -6px rgba(37, 99, 235, 0.1)';
                    
                    setTimeout(() => {
                        property.element.style.transform = '';
                        property.element.style.boxShadow = '';
                    }, 2000);
                }, 100);
            }
        }
        
        closeSpotlight();
    }

    function navigateResults(direction) {
        if (searchResults.length === 0 || !spotlightResultsList) return;

        // Remove active class from current item
        const currentActive = spotlightResultsList.querySelector('.spotlight-result--active');
        if (currentActive) {
            currentActive.classList.remove('spotlight-result--active');
        }

        // Update active index
        if (direction === 'down') {
            activeResultIndex = (activeResultIndex + 1) % searchResults.length;
        } else if (direction === 'up') {
            activeResultIndex = activeResultIndex <= 0 ? searchResults.length - 1 : activeResultIndex - 1;
        }

        // Add active class to new item and scroll into view
        const newActive = spotlightResultsList.children[activeResultIndex];
        if (newActive) {
            newActive.classList.add('spotlight-result--active');
            newActive.scrollIntoView({ block: 'nearest' });
        }
    }

    // Event listeners
    spotlightTrigger?.addEventListener('click', openSpotlight);
    spotlightClose?.addEventListener('click', closeSpotlight);

    // Backdrop click to close
    spotlightModal.addEventListener('click', (e) => {
        if (e.target === spotlightModal) {
            closeSpotlight();
        }
    });

    // Search input
    spotlightInput?.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    // Keyboard navigation
    spotlightInput?.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Escape':
                closeSpotlight();
                break;
            case 'ArrowDown':
                e.preventDefault();
                navigateResults('down');
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigateResults('up');
                break;
            case 'Enter':
                e.preventDefault();
                if (activeResultIndex >= 0) {
                    selectResult(activeResultIndex);
                }
                break;
        }
    });

    // Global keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSpotlight();
        }
    });

    // Result clicks
    spotlightResultsList?.addEventListener('click', (e) => {
        const resultElement = e.target.closest('.spotlight-result');
        if (resultElement) {
            const index = parseInt(resultElement.dataset.index);
            selectResult(index);
        }
    });

    // Recent search clicks
    spotlightRecentsList?.addEventListener('click', (e) => {
        const recentItem = e.target.closest('.spotlight-recents__item');
        const removeButton = e.target.closest('.spotlight-recents__item__remove');
        
        if (removeButton) {
            e.stopPropagation();
            const searchQuery = removeButton.dataset.search;
            removeRecentSearch(searchQuery);
        } else if (recentItem) {
            const searchQuery = recentItem.dataset.search;
            if (spotlightInput) spotlightInput.value = searchQuery;
            performSearch(searchQuery);
        }
    });

    // Clear all recent searches
    spotlightClearRecents?.addEventListener('click', clearRecentSearches);

    // Initialize recent searches display
    renderRecentSearches();
})();

// Listing analytics modal integration
(function() {
    const analyticsModal = document.getElementById('listing-analytics-modal');
    const closeButton = document.getElementById('listing-analytics-close');
    const totalLeadsEl = document.getElementById('listing-analytics-total-leads');
    const qualifiedEl = document.getElementById('listing-analytics-qualified');
    const qualifiedRateEl = document.getElementById('listing-analytics-qualified-rate');
    const conversionEl = document.getElementById('listing-analytics-conversion');
    const leadCountEl = document.getElementById('listing-analytics-lead-count');
    const leadsListEl = document.getElementById('listing-analytics-leads');
    const titleEl = document.getElementById('listing-analytics-title');
    const subtitleEl = document.getElementById('listing-analytics-subtitle');
    const dateRangeEl = document.getElementById('listing-analytics-date-range');
    const activityCanvas = document.getElementById('listing-analytics-activity');
    const sourcesCanvas = document.getElementById('listing-analytics-sources');

    if (!analyticsModal || !window.Chart) {
        return;
    }

    const listingAnalyticsStore = {
        'listing-1': {
            property: {
                name: 'The Haven Loft',
                location: 'Borrowdale, Harare',
                status: 'Active',
                dateRange: 'Last 30 days'
            },
            metrics: {
                totalLeads: 24,
                qualified: 13,
                conversionRate: 28
            },
            trend: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                inquiries: [12, 15, 18, 17],
                tours: [5, 7, 9, 8],
                applications: [2, 3, 4, 5]
            },
            sources: {
                Marketplace: 10,
                'Agent Network': 6,
                Referrals: 5,
                Website: 3
            },
            leads: [
                {
                    name: 'Chipo Moyo',
                    status: 'Hot',
                    stage: 'Lease sent',
                    lastActive: '2 days ago',
                    channel: 'Marketplace',
                    notes: 'Awaiting signed lease after second viewing last weekend.'
                },
                {
                    name: 'Kuda Chari',
                    status: 'Warm',
                    stage: 'Tour scheduled',
                    lastActive: '4 days ago',
                    channel: 'Website',
                    notes: 'Requested rent negotiation; wants to move in by October.'
                },
                {
                    name: 'Rufaro Banda',
                    status: 'New',
                    stage: 'Inquiry',
                    lastActive: 'Today',
                    channel: 'Agent Network',
                    notes: 'Corporate tenant looking for a unit for expatriate staff.'
                },
                {
                    name: 'Natasha Jiri',
                    status: 'Warm',
                    stage: 'Application in review',
                    lastActive: '1 week ago',
                    channel: 'Referrals',
                    notes: 'Provided references, pending employer verification.'
                }
            ]
        },
        'listing-2': {
            property: {
                name: 'Bayview Suites',
                location: 'Victoria Island, Lagos',
                status: 'Active',
                dateRange: 'Last 30 days'
            },
            metrics: {
                totalLeads: 18,
                qualified: 9,
                conversionRate: 21
            },
            trend: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                inquiries: [8, 10, 12, 9],
                tours: [3, 4, 6, 5],
                applications: [1, 2, 3, 3]
            },
            sources: {
                Marketplace: 7,
                'Agent Network': 5,
                Referrals: 3,
                Website: 3
            },
            leads: [
                {
                    name: 'Tadiwa Chikafu',
                    status: 'Warm',
                    stage: 'Tour completed',
                    lastActive: '3 days ago',
                    channel: 'Marketplace',
                    notes: 'Prefers a 12-month lease, awaiting partner approval.'
                },
                {
                    name: 'Amahle Dube',
                    status: 'Hot',
                    stage: 'Offer accepted',
                    lastActive: 'Yesterday',
                    channel: 'Agent Network',
                    notes: 'Deposits secured, move-in planned for next month.'
                },
                {
                    name: 'Miguel T.',
                    status: 'New',
                    stage: 'Inquiry',
                    lastActive: '5 hours ago',
                    channel: 'Website',
                    notes: 'Requesting furnished option with utilities included.'
                }
            ]
        },
        'listing-3': {
            property: {
                name: 'Maple Court',
                location: 'Avondale, Harare',
                status: 'Active',
                dateRange: 'Quarter to date'
            },
            metrics: {
                totalLeads: 32,
                qualified: 15,
                conversionRate: 18
            },
            trend: {
                labels: ['Jul', 'Aug', 'Sep'],
                inquiries: [10, 12, 10],
                tours: [4, 6, 5],
                applications: [2, 3, 3]
            },
            sources: {
                Marketplace: 12,
                Referrals: 8,
                'Agent Network': 7,
                Website: 5
            },
            leads: [
                {
                    name: 'Farai Chisango',
                    status: 'Hot',
                    stage: 'Lease sent',
                    lastActive: '3 days ago',
                    channel: 'Referrals',
                    notes: 'Couple relocating from Bulawayo, ready to place deposit.'
                },
                {
                    name: 'Pamela Zhou',
                    status: 'Warm',
                    stage: 'Tour scheduled',
                    lastActive: '2 days ago',
                    channel: 'Marketplace',
                    notes: 'Needs pet-friendly clause; tour booked for Friday.'
                },
                {
                    name: 'Lesedi K.',
                    status: 'Cold',
                    stage: 'Nurture',
                    lastActive: '3 weeks ago',
                    channel: 'Website',
                    notes: 'Budget constraints, watching for price adjustments.'
                },
                {
                    name: 'Kudzai M.',
                    status: 'New',
                    stage: 'Inquiry',
                    lastActive: 'Today',
                    channel: 'Agent Network',
                    notes: 'Corporate lease for regional director pending internal approval.'
                }
            ]
        },
        'listing-4': {
            property: {
                name: 'Palm Grove Villas',
                location: 'Borrowdale Brooke, Harare',
                status: 'Draft',
                dateRange: 'Pre-launch snapshot'
            },
            metrics: {
                totalLeads: 6,
                qualified: 2,
                conversionRate: 12
            },
            trend: {
                labels: ['Preview week 1', 'Preview week 2', 'Launch week'],
                inquiries: [2, 3, 4],
                tours: [0, 1, 2],
                applications: [0, 0, 1]
            },
            sources: {
                'Agent Network': 2,
                Referrals: 2,
                Website: 1,
                'Private Preview': 1
            },
            leads: [
                {
                    name: 'Blessing N.',
                    status: 'Warm',
                    stage: 'Virtual tour requested',
                    lastActive: '6 days ago',
                    channel: 'Agent Network',
                    notes: 'Waiting on updated photography before confirming onsite tour.'
                },
                {
                    name: 'Onai K.',
                    status: 'New',
                    stage: 'Inquiry',
                    lastActive: 'Yesterday',
                    channel: 'Referrals',
                    notes: 'Family of four, wants to preview floor plans once staging complete.'
                },
                {
                    name: 'Tatenda & Tari',
                    status: 'Cold',
                    stage: 'Nurture',
                    lastActive: '2 weeks ago',
                    channel: 'Private Preview',
                    notes: 'Still securing financing; keep updated on launch date.'
                }
            ]
        }
    };

    const statusClassMap = {
        hot: 'listing-analytics__lead-status--hot',
        warm: 'listing-analytics__lead-status--warm',
        new: '',
        cold: 'listing-analytics__lead-status--cold',
        nurture: 'listing-analytics__lead-status--cold'
    };

    let activityChartInstance = null;
    let sourcesChartInstance = null;
    let isOpen = false;

    const getColor = (token, fallback) => {
        const value = getComputedStyle(document.documentElement).getPropertyValue(token);
        return value && value.trim() ? value.trim() : fallback;
    };

    const palette = {
        primary: getColor('--color-primary', '#2563eb'),
        primaryLight: getColor('--color-primary-light', '#3b82f6'),
        success: getColor('--color-success', '#10b981'),
        warning: getColor('--color-warning', '#f59e0b'),
        gray: getColor('--color-gray-300', '#d1d5db')
    };

    const fallbackAnalytics = (listingId, card) => {
        const title = card?.querySelector('.listing-card__title')?.textContent.trim() || 'Property analytics';
        const location = card?.querySelector('.listing-card__location')?.textContent.trim() || '';
        const status = card?.dataset.status === 'draft' ? 'Draft' : 'Active';

        const stats = Array.from(card?.querySelectorAll('.listing-card__stat') || []);
        let totalLeads = 0;
        stats.forEach((stat) => {
            const label = stat.querySelector('.listing-card__stat-label')?.textContent.toLowerCase() || '';
            const valueText = stat.querySelector('.listing-card__stat-value')?.textContent || '0';
            const numericValue = Number.parseInt(valueText.replace(/[^0-9]/g, ''), 10);
            if (Number.isFinite(numericValue) && (label.includes('lead') || label.includes('interest'))) {
                totalLeads = numericValue;
            }
        });

        const safeLeads = Number.isFinite(totalLeads) ? totalLeads : 0;

        return {
            property: {
                name: title,
                location,
                status,
                dateRange: 'Last 30 days'
            },
            metrics: {
                totalLeads: safeLeads,
                qualified: Math.max(Math.round(safeLeads * 0.4), 0),
                conversionRate: 18
            },
            trend: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                inquiries: [4, 6, 5, 7],
                tours: [1, 2, 2, 3],
                applications: [0, 1, 1, 1]
            },
            sources: {
                Marketplace: 3,
                Website: 2,
                Referrals: 2,
                'Agent Network': 1
            },
            leads: []
        };
    };

    const formatPeopleLabel = (count) => {
        if (count === 1) return '1 person';
        return `${count} people`;
    };

    const renderLeadList = (leads) => {
        leadsListEl.innerHTML = '';

        if (!leads.length) {
            const emptyState = document.createElement('li');
            emptyState.className = 'listing-analytics__empty';
            emptyState.textContent = 'No lead records yet. Capture inquiries to see them here.';
            leadsListEl.appendChild(emptyState);
            return;
        }

        leads.forEach((lead) => {
            const item = document.createElement('li');
            item.className = 'listing-analytics__lead';

            const header = document.createElement('div');
            header.className = 'listing-analytics__lead-header';

            const name = document.createElement('span');
            name.className = 'listing-analytics__lead-name';
            name.textContent = lead.name;

            const status = document.createElement('span');
            const statusKey = (lead.status || '').toLowerCase();
            const statusClass = (statusClassMap[statusKey] || '').trim();
            status.className = `listing-analytics__lead-status ${statusClass}`.trim();
            status.textContent = lead.status || 'Lead';

            header.appendChild(name);
            header.appendChild(status);

            const meta = document.createElement('div');
            meta.className = 'listing-analytics__lead-meta';

            if (lead.stage) {
                const stage = document.createElement('span');
                stage.textContent = `Stage: ${lead.stage}`;
                meta.appendChild(stage);
            }

            if (lead.channel) {
                const channel = document.createElement('span');
                channel.textContent = `Source: ${lead.channel}`;
                meta.appendChild(channel);
            }

            if (lead.lastActive) {
                const lastActive = document.createElement('span');
                lastActive.textContent = `Last activity: ${lead.lastActive}`;
                meta.appendChild(lastActive);
            }

            if (meta.childElementCount) {
                item.appendChild(meta);
            }

            if (lead.notes) {
                const note = document.createElement('p');
                note.className = 'listing-analytics__lead-note';
                note.textContent = lead.notes;
                item.appendChild(note);
            }

            leadsListEl.appendChild(item);
        });
    };

    const upsertActivityChart = (trend) => {
        const datasets = [
            {
                label: 'Inquiries',
                data: trend.inquiries,
                borderColor: palette.primary,
                backgroundColor: palette.primary,
                fill: false,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: palette.primary
            },
            {
                label: 'Tours',
                data: trend.tours,
                borderColor: palette.primaryLight,
                backgroundColor: palette.primaryLight,
                fill: false,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: palette.primaryLight
            },
            {
                label: 'Applications',
                data: trend.applications,
                borderColor: palette.success,
                backgroundColor: palette.success,
                fill: false,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: palette.success
            }
        ];

        if (!activityChartInstance) {
            activityChartInstance = new Chart(activityCanvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: trend.labels,
                    datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            align: 'start',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 8,
                                color: getColor('--color-gray-600', '#4b5563'),
                                font: {
                                    family: 'Inter'
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: getColor('--color-gray-500', '#6b7280')
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            ticks: {
                                precision: 0,
                                color: getColor('--color-gray-500', '#6b7280')
                            },
                            grid: {
                                color: 'rgba(17, 24, 39, 0.08)'
                            }
                        }
                    }
                }
            });
        } else {
            activityChartInstance.data.labels = trend.labels;
            activityChartInstance.data.datasets.forEach((dataset, index) => {
                dataset.data = datasets[index].data;
                dataset.label = datasets[index].label;
                dataset.borderColor = datasets[index].borderColor;
                dataset.backgroundColor = datasets[index].backgroundColor;
            });
            activityChartInstance.update();
        }
    };

    const upsertSourcesChart = (sources) => {
        const labels = Object.keys(sources);
        const values = Object.values(sources);
        const colors = [palette.primary, palette.success, palette.warning, palette.primaryLight, palette.gray];

        if (!sourcesChartInstance) {
            sourcesChartInstance = new Chart(sourcesCanvas.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: colors.slice(0, values.length),
                            hoverOffset: 8,
                            borderWidth: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '58%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 10,
                                color: getColor('--color-gray-600', '#4b5563'),
                                font: {
                                    family: 'Inter'
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => `${context.label}: ${context.raw}`
                            }
                        }
                    }
                }
            });
        } else {
            sourcesChartInstance.data.labels = labels;
            sourcesChartInstance.data.datasets[0].data = values;
            sourcesChartInstance.data.datasets[0].backgroundColor = colors.slice(0, values.length);
            sourcesChartInstance.update();
        }
    };

    const populateModal = (listing) => {
        const { property, metrics, trend, sources, leads } = listing;

        titleEl.textContent = property.name || 'Property Analytics';
        subtitleEl.textContent = property.location ? `${property.location} • ${property.status}` : property.status || '';
        dateRangeEl.textContent = property.dateRange || 'Last 30 days';

        totalLeadsEl.textContent = metrics.totalLeads ?? 0;
        qualifiedEl.textContent = metrics.qualified ?? 0;
        const qualifiedRate = metrics.totalLeads ? Math.round((metrics.qualified / metrics.totalLeads) * 100) : 0;
        qualifiedRateEl.textContent = `${qualifiedRate}% of leads`;
        conversionEl.textContent = `${metrics.conversionRate ?? 0}%`;

        leadCountEl.textContent = formatPeopleLabel(leads.length || 0);
        renderLeadList(leads || []);

        upsertActivityChart(trend);
        upsertSourcesChart(sources);
    };

    const openAnalyticsModal = (listingId, card) => {
        const listing = listingAnalyticsStore[listingId] || fallbackAnalytics(listingId, card);
        populateModal(listing);

        analyticsModal.style.display = 'flex';
        analyticsModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        isOpen = true;

        // Focus close button for accessibility
        closeButton?.focus();
    };

    const closeAnalyticsModal = () => {
        analyticsModal.style.display = 'none';
        analyticsModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        isOpen = false;
    };

    const triggers = Array.from(document.querySelectorAll('[data-analytics-trigger]'));
    triggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            const listingCard = trigger.closest('.listing-card');
            if (!listingCard) return;
            const listingId = listingCard.dataset.listingId;
            openAnalyticsModal(listingId, listingCard);
        });
    });

    closeButton?.addEventListener('click', closeAnalyticsModal);

    analyticsModal.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal__backdrop')) {
            closeAnalyticsModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!isOpen) return;
        if (event.key === 'Escape') {
            closeAnalyticsModal();
        }
    });
})();
// Listings filter functionality
(function() {
    const filterButtons = Array.from(document.querySelectorAll('.listings__filter'));
    const listingCards = Array.from(document.querySelectorAll('.listing-card'));
    let activeListingFilter = 'all';

    const applyListingFilters = () => {
        listingCards.forEach(card => {
            const matchesCategory = activeListingFilter === 'all' || card.dataset.category === activeListingFilter;
            card.hidden = !matchesCategory;
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            activeListingFilter = button.dataset.filter || 'all';

            filterButtons.forEach(btn => {
                const isActive = btn === button;
                btn.classList.toggle('listings__filter--active', isActive);
                btn.setAttribute('aria-selected', isActive.toString());
            });

            applyListingFilters();
        });
    });

    applyListingFilters();
})();

// Radio group functionality for property types and status
(function() {
    const radioGroups = document.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        const radios = group.querySelectorAll('.radio-group__input');
        const options = group.querySelectorAll('.radio-group__option');

        radios.forEach((radio, index) => {
            radio.addEventListener('change', () => {
                options.forEach(option => option.classList.remove('radio-group__option--selected'));
                if (radio.checked) {
                    options[index].classList.add('radio-group__option--selected');
                }
            });
        });
    });
})();

// Profile Modal Functionality
(function() {
    // Helper functions for element selection
    function findProfileCardByButtonText(buttonText) {
        const profileCards = document.querySelectorAll('.profile-card');
        for (const card of profileCards) {
            const button = Array.from(card.querySelectorAll('.profile-card__button')).find(btn => 
                btn.textContent.trim().includes(buttonText)
            );
            if (button) return card;
        }
        return null;
    }
    
    function safeElementQuery(selector, parent = document) {
        try {
            return parent.querySelector(selector);
        } catch (error) {
            console.warn(`Element query failed for selector: ${selector}`, error);
            return null;
        }
    }
    
    function safeTextUpdate(element, newText) {
        if (element && typeof newText === 'string') {
            element.textContent = newText;
            return true;
        }
        return false;
    }

    // Modal management system
    const modals = {
        'password-change': document.getElementById('password-change-modal'),
        'twofa-setup': document.getElementById('twofa-setup-modal'),
        'sessions': document.getElementById('sessions-modal'),
        'bank-account': document.getElementById('bank-account-modal'),
        'file-upload': document.getElementById('file-upload-modal'),
        'payout-schedule': document.getElementById('payout-schedule-modal'),
        'tax-info': document.getElementById('tax-info-modal'),
        'avatar-upload': document.getElementById('avatar-upload-modal')
    };

    // Centralized modal controller
    function openModal(modalId) {
        const modal = modals[modalId];
        if (!modal) return;
        
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstInput = modal.querySelector('input, button, select, textarea');
        if (firstInput) firstInput.focus();
    }

    function closeModal(modalId) {
        const modal = modals[modalId];
        if (!modal) return;
        
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Reset forms
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // Reset any modal-specific states
        if (modalId === 'twofa-setup') resetTwoFAModal();
        if (modalId === 'file-upload') resetFileUpload();
        if (modalId === 'avatar-upload') resetAvatarUpload();
    }

    // Password Change Modal
    const passwordForm = document.getElementById('password-change-form');
    const passwordCancelBtn = document.getElementById('password-modal-cancel');
    
    passwordCancelBtn?.addEventListener('click', () => closeModal('password-change'));
    
    passwordForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Simple validation
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        
        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }
        
        // Simulate password change
        alert('Password updated successfully!');
        
        // Update the profile card
        const securityCard = findProfileCardByButtonText('Change Password');
        if (securityCard) {
            const statusText = safeElementQuery('.profile-card__item span', securityCard);
            safeTextUpdate(statusText, 'Last changed just now');
        }
        
        closeModal('password-change');
    });

    // 2FA Setup Modal
    let currentTwoFAStep = 1;
    const twofaNextBtn = document.getElementById('twofa-next-step');
    const twofaBackBtn = document.getElementById('twofa-back-step');
    const twofaVerifyBtn = document.getElementById('twofa-verify');
    const twofaCancelBtn = document.getElementById('twofa-modal-cancel');
    
    function resetTwoFAModal() {
        currentTwoFAStep = 1;
        document.getElementById('twofa-step-1').style.display = 'block';
        document.getElementById('twofa-step-2').style.display = 'none';
        document.getElementById('twofa-code').value = '';
    }
    
    twofaNextBtn?.addEventListener('click', () => {
        currentTwoFAStep = 2;
        document.getElementById('twofa-step-1').style.display = 'none';
        document.getElementById('twofa-step-2').style.display = 'block';
        document.getElementById('twofa-code').focus();
    });
    
    twofaBackBtn?.addEventListener('click', () => {
        currentTwoFAStep = 1;
        document.getElementById('twofa-step-1').style.display = 'block';
        document.getElementById('twofa-step-2').style.display = 'none';
    });
    
    twofaVerifyBtn?.addEventListener('click', () => {
        const code = document.getElementById('twofa-code').value;
        
        if (code.length !== 6) {
            alert('Please enter a 6-digit verification code!');
            return;
        }
        
        // Simulate 2FA verification
        alert('Two-factor authentication enabled successfully!');
        
        // Update the profile card
        const securityCard = findProfileCardByButtonText('Enable 2FA');
        if (securityCard) {
            const statusElement = safeElementQuery('.profile-card__status', securityCard);
            const buttonElement = safeElementQuery('.profile-card__button', securityCard);
            
            if (statusElement) {
                statusElement.textContent = 'Enabled';
                statusElement.className = 'profile-card__status profile-card__status--enabled';
            }
            if (buttonElement) {
                buttonElement.textContent = 'Manage 2FA';
            }
        }
        
        closeModal('twofa-setup');
    });
    
    twofaCancelBtn?.addEventListener('click', () => closeModal('twofa-setup'));

    // Sessions Management Modal
    const sessionsCloseBtn = document.getElementById('sessions-modal-close');
    const revokeAllBtn = document.getElementById('revoke-all-sessions');
    
    sessionsCloseBtn?.addEventListener('click', () => closeModal('sessions'));
    
    revokeAllBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to revoke all other sessions? You will need to sign in again on those devices.')) {
            // Remove all non-current sessions
            const sessions = document.querySelectorAll('.session-item:not(.session-item--current)');
            sessions.forEach(session => session.remove());
            
            alert('All other sessions have been revoked successfully!');
        }
    });
    
    // Individual session revoke buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('session-item__revoke')) {
            const sessionItem = e.target.closest('.session-item');
            const deviceName = sessionItem.querySelector('.session-item__device').textContent;
            
            if (confirm(`Revoke session for ${deviceName}?`)) {
                sessionItem.remove();
                alert('Session revoked successfully!');
            }
        }
    });

    // Bank Account Modal
    const bankForm = document.getElementById('bank-account-form');
    const bankCancelBtn = document.getElementById('bank-modal-cancel');
    
    bankCancelBtn?.addEventListener('click', () => closeModal('bank-account'));
    
    bankForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const bankName = document.getElementById('bank-name').value;
        const accountNumber = document.getElementById('account-number').value;
        const accountHolderName = document.getElementById('account-holder-name').value;
        const accountType = document.getElementById('account-type').value;
        
        if (!bankName || !accountNumber || !accountHolderName || !accountType) {
            alert('Please fill in all required fields!');
            return;
        }
        
        // Simulate bank account update
        alert('Bank account updated successfully!');
        
        // Update the profile card
        const bankCard = document.querySelector('.bank-account');
        if (bankCard) {
            const bankNameElement = bankCard.querySelector('.bank-account__name');
            const accountNumberElement = bankCard.querySelector('.bank-account__number');
            const accountTypeElement = bankCard.querySelector('.bank-account__type');
            
            if (bankNameElement) bankNameElement.textContent = bankName;
            if (accountNumberElement) accountNumberElement.textContent = `****${accountNumber.slice(-4)}`;
            if (accountTypeElement) accountTypeElement.textContent = accountType.charAt(0).toUpperCase() + accountType.slice(1) + ' Account';
        }
        
        closeModal('bank-account');
    });

    // File Upload Modal
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.getElementById('file-preview');
    const fileSubmitBtn = document.getElementById('file-upload-submit');
    const fileCancelBtn = document.getElementById('file-modal-cancel');
    let selectedFile = null;
    
    function resetFileUpload() {
        selectedFile = null;
        filePreview.style.display = 'none';
        fileSubmitBtn.disabled = true;
        fileInput.value = '';
    }
    
    fileUploadArea?.addEventListener('click', () => fileInput?.click());
    
    fileUploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('drag-over');
    });
    
    fileUploadArea?.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('drag-over');
    });
    
    fileUploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });
    
    fileInput?.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });
    
    function handleFileSelection(file) {
        // Validate file type and size
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a PDF, JPG, or PNG file.');
            return;
        }
        
        if (file.size > maxSize) {
            alert('File size must be less than 10MB.');
            return;
        }
        
        selectedAvatarFile = file;
        
        // Update preview
        const fileName = filePreview.querySelector('.file-preview-name');
        const fileSize = filePreview.querySelector('.file-preview-size');
        
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = `${(file.size / 1024 / 1024).toFixed(1)} MB`;
        
        filePreview.style.display = 'block';
        fileSubmitBtn.disabled = false;
    }
    
    // File remove button
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('file-preview-remove')) {
            resetFileUpload();
        }
    });
    
    fileCancelBtn?.addEventListener('click', () => closeModal('file-upload'));
    
    fileSubmitBtn?.addEventListener('click', () => {
        if (!selectedFile) return;
        
        // Simulate file upload
        alert('Business registration document uploaded successfully!');
        
        // Update verification card
        const verificationItem = document.querySelector('.verification-item--pending');
        if (verificationItem) {
            verificationItem.className = 'verification-item verification-item--complete';
            const icon = verificationItem.querySelector('.verification-item__icon svg');
            const description = verificationItem.querySelector('.verification-item__description');
            const action = verificationItem.querySelector('.verification-item__action');
            
            if (icon) {
                icon.innerHTML = '<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>';
            }
            if (description) description.textContent = 'Uploaded and under review';
            if (action) action.remove();
            
            // Update progress
            const progressFill = document.querySelector('.verification-progress__fill');
            const progressText = document.querySelector('.verification-progress__text');
            const progressSpan = document.querySelector('.profile-card__progress');
            
            if (progressFill) progressFill.style.width = '100%';
            if (progressText) progressText.textContent = '5 of 5 verification steps completed';
            if (progressSpan) progressSpan.textContent = '100% complete';
        }
        
        closeModal('file-upload');
    });

    // Global modal management
    document.addEventListener('click', (e) => {
        // Close modals when clicking backdrop
        if (e.target.classList.contains('modal__backdrop')) {
            Object.keys(modals).forEach(modalId => {
                if (modals[modalId].style.display === 'flex') {
                    closeModal(modalId);
                }
            });
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            Object.keys(modals).forEach(modalId => {
                if (modals[modalId].style.display === 'flex') {
                    closeModal(modalId);
                }
            });
        }
    });

    // Payout Schedule Modal
    const payoutScheduleForm = document.getElementById('payout-schedule-form');
    
    payoutScheduleForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const frequency = document.getElementById('payout-frequency').value;
        const day = document.getElementById('payout-day').value;
        const minimum = document.getElementById('minimum-payout').value;
        
        // Simulate save
        alert(`Payout schedule updated: ${frequency} on ${day}s with $${minimum} minimum`);
        
        // Update the profile card
        const payoutCard = findProfileCardByButtonText('Change Schedule');
        if (payoutCard) {
            const scheduleText = safeElementQuery('.profile-card__item span', payoutCard);
            if (scheduleText) {
                const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);
                const frequencyText = frequency === 'weekly' ? 'Weekly' : frequency === 'bi-weekly' ? 'Bi-weekly' : 'Monthly';
                safeTextUpdate(scheduleText, `${frequencyText} payouts every ${dayCapitalized}`);
            }
        }
        
        closeModal('payout-schedule');
    });

    // Tax Information Modal
    const taxInfoForm = document.getElementById('tax-info-form');
    const vatRegisteredSelect = document.getElementById('vat-registered');
    const vatNumberGroup = document.getElementById('vat-number-group');
    
    // Show/hide VAT number field based on registration status
    vatRegisteredSelect?.addEventListener('change', (e) => {
        if (e.target.value === 'yes') {
            vatNumberGroup.style.display = 'block';
            document.getElementById('vat-number').required = true;
        } else {
            vatNumberGroup.style.display = 'none';
            document.getElementById('vat-number').required = false;
        }
    });
    
    taxInfoForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taxId = document.getElementById('tax-id').value;
        const classification = document.getElementById('tax-classification').value;
        const vatRegistered = vatRegisteredSelect?.value === 'yes';
        
        // Simulate save
        alert('Tax information updated successfully!');
        
        // Update the profile card
        const taxCard = findProfileCardByButtonText('Update');
        if (taxCard) {
            const taxIdText = safeElementQuery('.profile-card__item div span', taxCard);
            if (taxIdText && taxId) {
                // Safely mask the tax ID - handle short IDs
                const maskedId = taxId.length > 6 ? 
                    '****' + taxId.slice(-6) : 
                    '****' + taxId.slice(-Math.min(taxId.length, 4));
                safeTextUpdate(taxIdText, `Tax ID: ${maskedId}`);
            }
            const lastUpdated = safeElementQuery('.profile-card__detail', taxCard);
            safeTextUpdate(lastUpdated, 'Last updated: just now');
        }
        
        closeModal('tax-info');
    });

    // Avatar Upload Modal
    const avatarUploadArea = document.getElementById('avatar-upload-area');
    const avatarFileInput = document.getElementById('avatar-file-input');
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarSaveBtn = document.getElementById('avatar-save');
    const removeAvatarBtn = document.getElementById('remove-avatar');
    let selectedAvatarFile = null;
    
    function resetAvatarUpload() {
        selectedAvatarFile = null;
        if (avatarSaveBtn) avatarSaveBtn.disabled = true;
        if (avatarPreview) avatarPreview.src = 'assets/avatar-owner.png';
        if (avatarFileInput) avatarFileInput.value = '';
    }
    
    // Handle file selection via click
    avatarUploadArea?.addEventListener('click', () => {
        avatarFileInput?.click();
    });
    
    // Handle file selection
    avatarFileInput?.addEventListener('change', (e) => {
        handleAvatarFile(e.target.files[0]);
    });
    
    // Handle drag and drop
    avatarUploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        avatarUploadArea.style.background = 'var(--color-primary-50)';
        avatarUploadArea.style.borderColor = 'var(--color-primary)';
    });
    
    avatarUploadArea?.addEventListener('dragleave', () => {
        avatarUploadArea.style.background = 'var(--color-gray-50)';
        avatarUploadArea.style.borderColor = 'var(--color-gray-300)';
    });
    
    avatarUploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        avatarUploadArea.style.background = 'var(--color-gray-50)';
        avatarUploadArea.style.borderColor = 'var(--color-gray-300)';
        
        const file = e.dataTransfer.files[0];
        handleAvatarFile(file);
    });
    
    function handleAvatarFile(file) {
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        selectedAvatarFile = file;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (avatarPreview && e.target.result) {
                avatarPreview.src = e.target.result;
            }
            if (avatarSaveBtn) {
                avatarSaveBtn.disabled = false;
            }
        };
        reader.onerror = () => {
            alert('Error reading file. Please try again.');
            console.error('FileReader error');
        };
        reader.readAsDataURL(file);
    }
    
    // Save avatar
    avatarSaveBtn?.addEventListener('click', () => {
        if (!selectedAvatarFile) return;
        
        // Simulate upload
        alert('Profile photo updated successfully!');
        
        // Update all avatar images in the profile
        const profileAvatar = safeElementQuery('.profile-avatar__image');
        if (profileAvatar && avatarPreview) {
            profileAvatar.src = avatarPreview.src;
        }
        
        closeModal('avatar-upload');
    });
    
    // Remove avatar
    removeAvatarBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove your profile photo?')) {
            if (avatarPreview) {
                avatarPreview.src = 'assets/avatar-owner.png'; // Default avatar
            }
            const profileAvatar = safeElementQuery('.profile-avatar__image');
            if (profileAvatar) {
                profileAvatar.src = 'assets/avatar-owner.png';
            }
            
            selectedAvatarFile = null;
            if (avatarSaveBtn) {
                avatarSaveBtn.disabled = true;
            }
            
            alert('Profile photo removed successfully!');
            closeModal('avatar-upload');
        }
    });

    // Expose modal functions for button connections
    window.openProfileModal = openModal;
    window.closeProfileModal = closeModal;
    
})();

// Success Modal Management
(function() {
    const successModal = document.getElementById('success-modal');
    const successModalTitle = document.getElementById('success-modal-title');
    const successModalMessage = document.getElementById('success-modal-message');
    const successModalStatus = document.getElementById('success-modal-status');
    const successModalClose = document.getElementById('success-modal-close');
    
    let autoCloseTimeout;
    
    function showSuccessModal(action, isPublished, customTitle = null, customMessage = null) {
        if (!successModal) return;
        
        // Clear any existing auto-close timeout
        if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout);
        }
        
        // Set title based on action
        const title = customTitle || (action === 'created' ? 'Listing Created!' : 'Listing Updated!');
        if (successModalTitle) {
            successModalTitle.textContent = title;
        }
        
        // Set message based on action and status
        let message;
        if (customMessage) {
            message = customMessage;
        } else if (action === 'created') {
            message = isPublished 
                ? 'Your listing has been created and is now live on the platform.' 
                : 'Your listing has been created and saved as a draft.';
        } else {
            message = isPublished 
                ? 'Your listing has been updated and is now live on the platform.' 
                : 'Your listing has been updated and saved as a draft.';
        }
        
        if (successModalMessage) {
            successModalMessage.textContent = message;
        }
        
        // Show/hide status badge
        if (successModalStatus) {
            const statusBadge = successModalStatus.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = isPublished ? 'Published' : 'Draft';
                statusBadge.className = `status-badge ${isPublished ? 'status-badge--success' : 'status-badge--progress'}`;
            }
            successModalStatus.style.display = 'flex';
        }
        
        // Show modal
        successModal.style.display = 'flex';
        successModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Auto-close after 4 seconds
        autoCloseTimeout = setTimeout(() => {
            closeSuccessModal();
        }, 4000);
    }
    
    function closeSuccessModal() {
        if (!successModal) return;
        
        // Clear auto-close timeout
        if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout);
        }
        
        // Hide modal
        successModal.style.display = 'none';
        successModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Hide status badge
        if (successModalStatus) {
            successModalStatus.style.display = 'none';
        }
    }
    
    // Event listeners
    successModalClose?.addEventListener('click', closeSuccessModal);
    
    // Close on backdrop click
    successModal?.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal?.style.display === 'flex') {
            closeSuccessModal();
        }
    });
    
    // Expose success modal functions globally
    window.showSuccessModal = showSuccessModal;
    window.closeSuccessModal = closeSuccessModal;
    
})();

// View Listing Modal functionality
(function() {
    const viewModal = document.getElementById('view-listing-modal');
    const viewCloseBtn = document.getElementById('view-listing-close');
    const viewBackdrop = viewModal?.querySelector('.modal__backdrop');
    
    if (!viewModal) return;

    function openViewModal(listingData, isPreview = false) {
        viewModal.style.display = 'flex';
        viewModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Update modal title based on mode
        const title = document.getElementById('view-listing-title');
        if (title) {
            title.textContent = isPreview ? 'Property Preview' : 'Property Details';
        }
        
        // Populate modal content
        populateListingData(listingData, isPreview);
        
        // Focus management
        const firstElement = viewModal.querySelector('button');
        if (firstElement) firstElement.focus();
    }

    function closeViewModal() {
        viewModal.style.display = 'none';
        viewModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function populateListingData(data, isPreview) {
        // Update status badge
        const statusBadge = document.querySelector('#view-listing-status .status-badge');
        if (statusBadge && data.status) {
            statusBadge.className = `status-badge status-badge--${data.status === 'active' ? 'success' : data.status === 'draft' ? 'draft' : 'warning'}`;
            statusBadge.textContent = isPreview ? 'Draft Preview' : (data.status === 'active' ? 'Active' : data.status.charAt(0).toUpperCase() + data.status.slice(1));
        }
        
        // Update carousel images
        initializeCarousel(data.images || [data.image].filter(Boolean))
        
        // Update property information
        const updates = {
            'view-listing-name': data.name || '-',
            'view-listing-type': data.type || '-',
            'view-listing-price': data.price || '-',
            'view-listing-bedrooms': data.bedrooms || '-',
            'view-listing-bathrooms': data.bathrooms || '-',
            'view-listing-sqft': data.sqft || '-',
            'view-listing-description': data.description || 'No description available.',
            'view-listing-location': data.location || '-',
            'view-listing-availability': data.availability || '-'
        };
        
        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
        
        // Update amenities
        const amenitiesContainer = document.getElementById('view-listing-amenities');
        if (amenitiesContainer) {
            amenitiesContainer.innerHTML = '';
            if (data.amenities && data.amenities.length > 0) {
                data.amenities.forEach(amenity => {
                    const chip = document.createElement('span');
                    chip.className = 'chip';
                    chip.textContent = amenity;
                    amenitiesContainer.appendChild(chip);
                });
            } else {
                amenitiesContainer.innerHTML = '<span class="view-listing__info-value">No amenities listed</span>';
            }
        }
        
        // Update distribution channels
        const channelsContainer = document.getElementById('view-listing-channels');
        if (channelsContainer) {
            channelsContainer.innerHTML = '';
            if (data.channels && data.channels.length > 0) {
                data.channels.forEach(channel => {
                    const chip = document.createElement('span');
                    chip.className = 'chip';
                    chip.textContent = channel;
                    channelsContainer.appendChild(chip);
                });
            } else {
                channelsContainer.innerHTML = '<span class="view-listing__info-value">No distribution channels</span>';
            }
        }
    }

    function generatePropertyImages(mainImageSrc) {
        // Generate multiple images for each property based on the main image
        if (!mainImageSrc) return [];
        
        // Extract property number from the main image (e.g., property1.jpg -> 1)
        const propertyMatch = mainImageSrc.match(/property(\d+)\.jpg/);
        const propertyNum = propertyMatch ? propertyMatch[1] : '1';
        
        // Create array of related images for this property
        const imageVariations = [
            mainImageSrc, // Main exterior
            `assets/images/property${propertyNum}.jpg`, // Same as main (exterior)
            `assets/images/property${propertyNum}-interior1.jpg`, // Living room (fallback to property1.jpg)
            `assets/images/property${propertyNum}-interior2.jpg`, // Kitchen (fallback to property2.jpg)
            `assets/images/property${propertyNum}-bedroom.jpg`, // Bedroom (fallback to property3.jpg)
            `assets/images/property${propertyNum}-bathroom.jpg` // Bathroom (fallback to property4.jpg)
        ];
        
        // For demo purposes, we'll use the existing property images as variations
        // In a real app, these would be actual multiple photos of the same property
        const fallbackImages = [
            'assets/images/property1.jpg',
            'assets/images/property2.jpg', 
            'assets/images/property3.jpg',
            'assets/images/property4.jpg'
        ];
        
        // Create a realistic set of 3-5 images per property
        const imageCount = Math.floor(Math.random() * 3) + 3; // 3-5 images
        const images = [];
        
        // Always include the main image first
        images.push(mainImageSrc);
        
        // Add additional images
        for (let i = 1; i < imageCount; i++) {
            const fallbackIndex = (parseInt(propertyNum) - 1 + i) % fallbackImages.length;
            images.push(fallbackImages[fallbackIndex]);
        }
        
        return images;
    }

    function getPropertyData(listingId, category, status) {
        const propertyDatabase = {
            'listing-1': {
                bedrooms: '3',
                bathrooms: '2.5',
                sqft: '2,400 sq ft',
                description: 'Experience luxury living in this stunning modern apartment featuring floor-to-ceiling windows, premium finishes, and breathtaking city views. The open-plan living area seamlessly connects to a gourmet kitchen with stainless steel appliances and granite countertops. Master suite includes walk-in closet and spa-like bathroom with rainfall shower.',
                amenities: ['Concierge Service', 'Rooftop Pool', 'Fitness Center', 'Parking Garage', 'Pet Friendly', '24/7 Security'],
                location: 'Borrowdale, Harare'
            },
            'listing-2': {
                bedrooms: '2',
                bathrooms: '2',
                sqft: '1,800 sq ft',
                description: 'Perfect for business professionals, this contemporary suite offers a sophisticated workspace with high-speed internet, modern conference facilities, and premium office amenities. Located in the heart of the business district with easy access to major corporations and public transportation.',
                amenities: ['High-Speed Internet', 'Conference Rooms', 'Business Center', 'Valet Parking', 'Catering Kitchen', 'Executive Lounge'],
                location: 'CBD, Harare'
            },
            'listing-3': {
                bedrooms: '4',
                bathrooms: '3',
                sqft: '3,200 sq ft',
                description: 'Spacious family home featuring an open-concept design perfect for entertaining. Large backyard with mature trees, updated kitchen with breakfast nook, and master suite with private balcony. Located in a quiet neighborhood with excellent schools and parks nearby.',
                amenities: ['Private Garden', 'Two-Car Garage', 'Study Room', 'Playground Access', 'Family Room', 'Storage Space'],
                location: 'Avondale, Harare'
            },
            'listing-4': {
                bedrooms: '5',
                bathrooms: '4',
                sqft: '4,500 sq ft',
                description: 'Luxurious country estate offering privacy and tranquility on 2 acres of landscaped grounds. Features include marble flooring, custom millwork, wine cellar, and resort-style pool. Perfect retreat from city life while maintaining easy access to urban amenities.',
                amenities: ['Private Pool', 'Wine Cellar', 'Home Theater', 'Guest House', 'Tennis Court', 'Landscaped Gardens'],
                location: 'Borrowdale Brooke, Harare'
            }
        };

        // Fallback data for unknown listings
        const fallbackData = {
            bedrooms: '3',
            bathrooms: '2',
            sqft: '2,000 sq ft',
            description: 'Beautiful property featuring modern amenities and excellent location. This well-maintained home offers comfortable living spaces and convenient access to local attractions.',
            amenities: ['Parking', 'Security', 'Maintenance'],
            location: 'Harare, Zimbabwe'
        };

        return propertyDatabase[listingId] || fallbackData;
    }

    function extractListingDataFromCard(card) {
        const img = card.querySelector('.listing-card__media img');
        const title = card.querySelector('.listing-card__title');
        const category = card.dataset.category;
        const status = card.dataset.status;
        const listingId = card.dataset.listingId;
        const price = card.querySelector('.listing-card__price');
        const location = card.querySelector('.listing-card__location');
        const channels = Array.from(card.querySelectorAll('.listing-card__channels .chip')).map(chip => chip.textContent.trim());
        
        // Extract schedule information for availability
        const scheduleValue = card.querySelector('.listing-card__schedule-value');
        const availability = scheduleValue ? scheduleValue.textContent.trim() : 'Available';
        
        // Generate multiple property images based on the main image
        const mainImageSrc = img ? img.src : '';
        const propertyImages = generatePropertyImages(mainImageSrc);

        // Get hardcoded property data
        const propertyData = getPropertyData(listingId, category, status);

        return {
            name: title ? title.textContent.trim() : 'Untitled Property',
            type: category || 'Property',
            status: status || 'active',
            price: price ? price.textContent.trim() : 'Price on request',
            location: propertyData.location,
            bedrooms: propertyData.bedrooms,
            bathrooms: propertyData.bathrooms,
            sqft: propertyData.sqft,
            description: propertyData.description,
            image: mainImageSrc,
            images: propertyImages,
            amenities: propertyData.amenities,
            channels: channels.length > 0 ? channels : ['Website'],
            availability: availability
        };
    }

    // Event listeners
    if (viewCloseBtn) {
        viewCloseBtn.addEventListener('click', closeViewModal);
    }

    if (viewBackdrop) {
        viewBackdrop.addEventListener('click', closeViewModal);
    }

    // Carousel functionality
    let currentSlide = 0;
    let totalSlides = 0;
    let carouselImages = [];

    function initializeCarousel(images) {
        carouselImages = images || [];
        totalSlides = carouselImages.length;
        currentSlide = 0;

        const carousel = document.getElementById('view-listing-carousel');
        const track = document.getElementById('carousel-track');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const currentImageSpan = document.getElementById('current-image');
        const totalImagesSpan = document.getElementById('total-images');
        const indicators = document.getElementById('carousel-indicators');

        if (!carousel || !track) return;

        // Clear existing content
        track.innerHTML = '';
        indicators.innerHTML = '';

        // Handle single image or no images
        if (totalSlides <= 1) {
            carousel.classList.add('image-carousel--single-image');
            if (totalSlides === 1) {
                const slide = createSlide(carouselImages[0], 0);
                track.appendChild(slide);
            }
            updateCounter();
            return;
        } else {
            carousel.classList.remove('image-carousel--single-image');
        }

        // Create slides
        carouselImages.forEach((image, index) => {
            const slide = createSlide(image, index);
            track.appendChild(slide);
        });

        // Create indicators
        carouselImages.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `image-carousel__indicator ${index === 0 ? 'image-carousel__indicator--active' : ''}`;
            indicator.setAttribute('aria-label', `Go to image ${index + 1}`);
            indicator.addEventListener('click', () => goToSlide(index));
            indicators.appendChild(indicator);
        });

        // Update counter
        updateCounter();

        // Update navigation buttons
        updateNavButtons();

        // Reset position
        updateCarouselPosition();
    }

    function createSlide(imageSrc, index) {
        const slide = document.createElement('div');
        slide.className = 'image-carousel__slide';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Property image ${index + 1}`;
        img.loading = 'lazy';
        img.style.cursor = 'pointer';
        img.title = 'Click to view fullscreen';
        
        // Add click handler to open fullscreen
        img.addEventListener('click', () => {
            openFullscreenCarousel(index);
        });
        
        slide.appendChild(img);
        return slide;
    }

    function updateCarouselPosition() {
        const track = document.getElementById('carousel-track');
        if (track) {
            const translateX = -currentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;
        }
    }

    function updateNavButtons() {
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentSlide === totalSlides - 1;
        }
    }

    function updateIndicators() {
        const indicators = document.querySelectorAll('.image-carousel__indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('image-carousel__indicator--active', index === currentSlide);
        });
    }

    function updateCounter() {
        const currentImageSpan = document.getElementById('current-image');
        const totalImagesSpan = document.getElementById('total-images');
        
        if (currentImageSpan) {
            currentImageSpan.textContent = totalSlides > 0 ? currentSlide + 1 : 0;
        }
        
        if (totalImagesSpan) {
            totalImagesSpan.textContent = totalSlides;
        }
    }

    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateCarouselPosition();
            updateNavButtons();
            updateIndicators();
            updateCounter();
        }
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Carousel event listeners
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const fullscreenTrigger = document.getElementById('carousel-fullscreen-trigger');

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    if (fullscreenTrigger) {
        fullscreenTrigger.addEventListener('click', () => {
            openFullscreenCarousel(currentSlide);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (viewModal?.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeViewModal();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const carousel = document.getElementById('view-listing-carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
    }

    // Fullscreen carousel functionality
    let fullscreenCurrentSlide = 0;
    let fullscreenTotalSlides = 0;
    let fullscreenImages = [];
    let isFullscreenActive = false;

    function openFullscreenCarousel(startIndex = 0) {
        const fullscreenCarousel = document.getElementById('fullscreen-carousel');
        if (!fullscreenCarousel) return;

        fullscreenImages = carouselImages; // Use the same images from regular carousel
        fullscreenTotalSlides = fullscreenImages.length;
        fullscreenCurrentSlide = startIndex;
        isFullscreenActive = true;

        // Show fullscreen modal
        fullscreenCarousel.style.display = 'flex';
        fullscreenCarousel.setAttribute('aria-hidden', 'false');
        fullscreenCarousel.classList.add('entering');
        document.body.style.overflow = 'hidden';

        // Initialize fullscreen carousel
        initializeFullscreenCarousel();

        // Remove entering class after animation
        setTimeout(() => {
            fullscreenCarousel.classList.remove('entering');
        }, 300);

        // Focus management
        const closeBtn = document.getElementById('fullscreen-close');
        if (closeBtn) closeBtn.focus();
    }

    function closeFullscreenCarousel() {
        const fullscreenCarousel = document.getElementById('fullscreen-carousel');
        if (!fullscreenCarousel) return;

        fullscreenCarousel.classList.add('exiting');
        
        setTimeout(() => {
            fullscreenCarousel.style.display = 'none';
            fullscreenCarousel.setAttribute('aria-hidden', 'true');
            fullscreenCarousel.classList.remove('exiting');
            document.body.style.overflow = '';
            isFullscreenActive = false;

            // Sync back to regular carousel
            if (fullscreenCurrentSlide !== currentSlide) {
                goToSlide(fullscreenCurrentSlide);
            }
        }, 300);
    }

    function initializeFullscreenCarousel() {
        const track = document.getElementById('fullscreen-track');
        const indicators = document.getElementById('fullscreen-indicators');
        const fullscreenCarousel = document.getElementById('fullscreen-carousel');

        if (!track || !indicators || !fullscreenCarousel) return;

        // Clear existing content
        track.innerHTML = '';
        indicators.innerHTML = '';

        // Handle single image or no images
        if (fullscreenTotalSlides <= 1) {
            fullscreenCarousel.classList.add('fullscreen-carousel--single-image');
            if (fullscreenTotalSlides === 1) {
                const slide = createFullscreenSlide(fullscreenImages[0], 0);
                track.appendChild(slide);
            }
            updateFullscreenCounter();
            return;
        } else {
            fullscreenCarousel.classList.remove('fullscreen-carousel--single-image');
        }

        // Create slides
        fullscreenImages.forEach((image, index) => {
            const slide = createFullscreenSlide(image, index);
            track.appendChild(slide);
        });

        // Create indicators
        fullscreenImages.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `fullscreen-carousel__indicator ${index === fullscreenCurrentSlide ? 'fullscreen-carousel__indicator--active' : ''}`;
            indicator.setAttribute('aria-label', `Go to image ${index + 1}`);
            indicator.addEventListener('click', () => goToFullscreenSlide(index));
            indicators.appendChild(indicator);
        });

        // Update UI
        updateFullscreenCarouselPosition();
        updateFullscreenNavButtons();
        updateFullscreenCounter();
    }

    function createFullscreenSlide(imageSrc, index) {
        const slide = document.createElement('div');
        slide.className = 'fullscreen-carousel__slide';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Property image ${index + 1}`;
        img.loading = 'lazy';
        
        slide.appendChild(img);
        return slide;
    }

    function updateFullscreenCarouselPosition() {
        const track = document.getElementById('fullscreen-track');
        if (track) {
            const translateX = -fullscreenCurrentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;
        }
    }

    function updateFullscreenNavButtons() {
        const prevBtn = document.getElementById('fullscreen-prev');
        const nextBtn = document.getElementById('fullscreen-next');
        
        if (prevBtn) {
            prevBtn.disabled = fullscreenCurrentSlide === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = fullscreenCurrentSlide === fullscreenTotalSlides - 1;
        }
    }

    function updateFullscreenIndicators() {
        const indicators = document.querySelectorAll('.fullscreen-carousel__indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('fullscreen-carousel__indicator--active', index === fullscreenCurrentSlide);
        });
    }

    function updateFullscreenCounter() {
        const currentSpan = document.getElementById('fullscreen-current');
        const totalSpan = document.getElementById('fullscreen-total');
        
        if (currentSpan) {
            currentSpan.textContent = fullscreenTotalSlides > 0 ? fullscreenCurrentSlide + 1 : 0;
        }
        
        if (totalSpan) {
            totalSpan.textContent = fullscreenTotalSlides;
        }
    }

    function goToFullscreenSlide(index) {
        if (index >= 0 && index < fullscreenTotalSlides) {
            fullscreenCurrentSlide = index;
            updateFullscreenCarouselPosition();
            updateFullscreenNavButtons();
            updateFullscreenIndicators();
            updateFullscreenCounter();
        }
    }

    function nextFullscreenSlide() {
        if (fullscreenCurrentSlide < fullscreenTotalSlides - 1) {
            goToFullscreenSlide(fullscreenCurrentSlide + 1);
        }
    }

    function prevFullscreenSlide() {
        if (fullscreenCurrentSlide > 0) {
            goToFullscreenSlide(fullscreenCurrentSlide - 1);
        }
    }

    // Fullscreen event listeners
    const fullscreenCloseBtn = document.getElementById('fullscreen-close');
    const fullscreenPrevBtn = document.getElementById('fullscreen-prev');
    const fullscreenNextBtn = document.getElementById('fullscreen-next');
    const fullscreenMaximizeBtn = document.getElementById('fullscreen-maximize');
    const fullscreenBackdrop = document.querySelector('.fullscreen-carousel__backdrop');

    if (fullscreenCloseBtn) {
        fullscreenCloseBtn.addEventListener('click', closeFullscreenCarousel);
    }

    if (fullscreenPrevBtn) {
        fullscreenPrevBtn.addEventListener('click', prevFullscreenSlide);
    }

    if (fullscreenNextBtn) {
        fullscreenNextBtn.addEventListener('click', nextFullscreenSlide);
    }

    if (fullscreenMaximizeBtn) {
        fullscreenMaximizeBtn.addEventListener('click', toggleBrowserFullscreen);
    }

    if (fullscreenBackdrop) {
        fullscreenBackdrop.addEventListener('click', closeFullscreenCarousel);
    }

    // Browser fullscreen functionality
    function toggleBrowserFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported or denied');
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Touch/swipe support for fullscreen
    let fullscreenTouchStartX = 0;
    let fullscreenTouchEndX = 0;

    const fullscreenCarousel = document.getElementById('fullscreen-carousel');
    if (fullscreenCarousel) {
        fullscreenCarousel.addEventListener('touchstart', (e) => {
            if (isFullscreenActive) {
                fullscreenTouchStartX = e.changedTouches[0].screenX;
            }
        });

        fullscreenCarousel.addEventListener('touchend', (e) => {
            if (isFullscreenActive) {
                fullscreenTouchEndX = e.changedTouches[0].screenX;
                handleFullscreenSwipe();
            }
        });
    }

    function handleFullscreenSwipe() {
        const swipeThreshold = 50;
        const diff = fullscreenTouchStartX - fullscreenTouchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextFullscreenSlide();
            } else {
                prevFullscreenSlide();
            }
        }
    }

    // Enhanced keyboard navigation for fullscreen
    document.addEventListener('keydown', (e) => {
        if (isFullscreenActive) {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    closeFullscreenCarousel();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    prevFullscreenSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextFullscreenSlide();
                    break;
                case 'F11':
                    e.preventDefault();
                    toggleBrowserFullscreen();
                    break;
            }
        }
    });

    // Expose functions globally
    window.openViewListingModal = function(listingCard) {
        const listingData = extractListingDataFromCard(listingCard);
        openViewModal(listingData, false);
    };
    
    window.openPreviewListingModal = function(listingCard) {
        const listingData = extractListingDataFromCard(listingCard);
        openViewModal(listingData, true);
    };

    window.openFullscreenCarousel = openFullscreenCarousel;
})();

// Sidebar Toggle Functionality
(function() {
    const sidebar = document.querySelector('.sidebar');
    const dashboard = document.querySelector('.dashboard');
    const toggleBtn = document.getElementById('sidebar-toggle');
    
    if (!sidebar || !dashboard || !toggleBtn) return;
    
    // Get initial state from localStorage or default to expanded
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    // Set initial state
    if (isCollapsed) {
        sidebar.setAttribute('data-collapsed', 'true');
        dashboard.classList.add('dashboard--sidebar-collapsed');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }
    
    function toggleSidebar() {
        const currentlyCollapsed = sidebar.getAttribute('data-collapsed') === 'true';
        const newCollapsedState = !currentlyCollapsed;
        
        // Update DOM attributes and classes
        sidebar.setAttribute('data-collapsed', newCollapsedState.toString());
        toggleBtn.setAttribute('aria-expanded', (!newCollapsedState).toString());
        
        if (newCollapsedState) {
            dashboard.classList.add('dashboard--sidebar-collapsed');
        } else {
            dashboard.classList.remove('dashboard--sidebar-collapsed');
        }
        
        // Persist state to localStorage
        localStorage.setItem('sidebarCollapsed', newCollapsedState.toString());
    }
    
    // Add event listener
    toggleBtn.addEventListener('click', toggleSidebar);

    // Optional: Add keyboard shortcut (Ctrl/Cmd + B)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
    });
})();

// Mobile Menu Toggle Functionality
(function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const sidebar = document.querySelector('.sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar__link');

    if (!mobileMenuToggle || !mobileOverlay || !sidebar) {
        return;
    }

    let isMenuOpen = false;

    function openMobileMenu() {
        isMenuOpen = true;
        sidebar.classList.add('sidebar--open');
        mobileOverlay.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.setAttribute('aria-label', 'Close navigation menu');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        isMenuOpen = false;
        sidebar.classList.remove('sidebar--open');
        mobileOverlay.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
        document.body.style.overflow = '';
    }

    function toggleMobileMenu() {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Toggle button click
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close when clicking overlay
    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Close when clicking a sidebar link (on mobile)
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                closeMobileMenu();
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });

    // Close menu on window resize if going to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && isMenuOpen) {
            closeMobileMenu();
        }
    });
})();

// Admin Approvals Functionality
(function() {
    const filterButtons = document.querySelectorAll('.admin-approvals__filter');
    const searchInput = document.getElementById('approval-search');
    const tableBody = document.getElementById('approvals-table-body');
    const emptyState = document.getElementById('approvals-empty');
    const modal = document.getElementById('approval-modal');
    const modalTitle = document.getElementById('approval-modal-title');
    const modalThumbnail = document.getElementById('approval-modal-thumbnail');
    const modalListingName = document.getElementById('approval-modal-listing-name');
    const modalListingOwner = document.getElementById('approval-modal-listing-owner');
    const modalCommentLabel = document.getElementById('approval-comment-label');
    const modalCommentHint = document.getElementById('approval-comment-hint');
    const modalComment = document.getElementById('approval-comment');
    const modalConfirm = document.getElementById('approval-modal-confirm');
    const modalCancel = document.getElementById('approval-modal-cancel');
    const modalClose = document.getElementById('approval-modal-close');
    const modalBackdrop = modal ? modal.querySelector('.modal__backdrop') : null;

    if (!filterButtons.length || !tableBody) {
        return;
    }

    let currentFilter = 'all';
    let currentSearch = '';
    let currentListingId = null;
    let currentAction = null;

    // Listing data for modal display (expanded with full details)
    const listingData = {
        'approval-1': {
            id: '#LST-2024-001',
            name: 'Sunset Villa',
            owner: 'John Moyo',
            ownerEmail: 'john.m@example.com',
            ownerPhone: '+263 77 123 4567',
            images: ['assets/images/property1.jpg', 'assets/images/property2.jpg', 'assets/images/property3.jpg'],
            type: 'Luxury Apartments',
            location: 'Borrowdale, Harare',
            price: '$2,500/mo',
            bedrooms: 3,
            bathrooms: 2,
            size: '1,800 sq ft',
            furnished: 'Yes',
            available: 'Immediately',
            description: 'Stunning modern villa with panoramic views of the surrounding hills. This beautifully appointed property features an open-plan living area, gourmet kitchen with top-of-the-line appliances, and a spacious master suite. The outdoor space includes a private pool, landscaped gardens, and a covered entertainment area perfect for hosting guests.',
            amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Air Conditioning', 'WiFi', 'Generator', 'Borehole'],
            submitted: 'Jan 15, 2026 at 2:30 PM',
            status: 'pending',
            notes: ''
        },
        'approval-2': {
            id: '#LST-2024-002',
            name: 'Garden View Apartment',
            owner: 'Sarah Ncube',
            ownerEmail: 'sarah.n@example.com',
            ownerPhone: '+263 77 234 5678',
            images: ['assets/images/property2.jpg', 'assets/images/property1.jpg', 'assets/images/property4.jpg'],
            type: 'Family Homes',
            location: 'Avondale, Harare',
            price: '$1,800/mo',
            bedrooms: 4,
            bathrooms: 3,
            size: '2,200 sq ft',
            furnished: 'Partially',
            available: 'Feb 1, 2026',
            description: 'Spacious family home with beautiful garden views. Features include a modern kitchen, separate dining room, large living area, and a private backyard with mature trees. Perfect for families seeking a peaceful suburban lifestyle with easy access to schools and amenities.',
            amenities: ['Garden', 'Parking', 'Security', 'Borehole', 'Solar Panels'],
            submitted: 'Jan 14, 2026 at 10:15 AM',
            status: 'pending',
            notes: ''
        },
        'approval-3': {
            id: '#LST-2024-003',
            name: 'Hillside Retreat',
            owner: 'Peter Dube',
            ownerEmail: 'peter.d@example.com',
            ownerPhone: '+263 77 345 6789',
            images: ['assets/images/property3.jpg', 'assets/images/property1.jpg', 'assets/images/property2.jpg'],
            type: 'Country Estates',
            location: 'Glen Lorne, Harare',
            price: '$3,200/mo',
            bedrooms: 5,
            bathrooms: 4,
            size: '3,500 sq ft',
            furnished: 'Yes',
            available: 'Immediately',
            description: 'Luxurious country estate set on 2 acres of beautifully landscaped grounds. This executive property offers unparalleled privacy and space, with stunning views of the surrounding countryside. Features include a home office, entertainment room, staff quarters, and extensive outdoor living areas.',
            amenities: ['Swimming Pool', 'Tennis Court', 'Garden', 'Staff Quarters', 'Security', 'Generator', 'Borehole', 'Air Conditioning'],
            submitted: 'Jan 13, 2026 at 4:45 PM',
            status: 'pending',
            notes: ''
        },
        'approval-4': {
            id: '#LST-2024-004',
            name: 'Executive Suite',
            owner: 'Grace Chikara',
            ownerEmail: 'grace.c@example.com',
            ownerPhone: '+263 77 456 7890',
            images: ['assets/images/property4.jpg', 'assets/images/property1.jpg'],
            type: 'Business Suites',
            location: 'Highlands, Harare',
            price: '$2,800/mo',
            bedrooms: 2,
            bathrooms: 2,
            size: '1,200 sq ft',
            furnished: 'Yes',
            available: 'Immediately',
            description: 'Premium executive suite in the heart of Highlands. Ideal for business professionals, this fully serviced apartment offers modern finishes, high-speed internet, and 24/7 security. Walking distance to restaurants, shops, and business centers.',
            amenities: ['Gym Access', 'Parking', 'Security', 'Air Conditioning', 'WiFi', 'Concierge'],
            submitted: 'Jan 10, 2026 at 9:00 AM',
            status: 'approved',
            notes: ''
        },
        'approval-5': {
            id: '#LST-2024-005',
            name: 'Modern Penthouse',
            owner: 'Michael Sithole',
            ownerEmail: 'michael.s@example.com',
            ownerPhone: '+263 77 567 8901',
            images: ['assets/images/property1.jpg', 'assets/images/property3.jpg', 'assets/images/property4.jpg'],
            type: 'Luxury Apartments',
            location: 'Mount Pleasant, Harare',
            price: '$4,500/mo',
            bedrooms: 3,
            bathrooms: 3,
            size: '2,500 sq ft',
            furnished: 'Yes',
            available: 'Mar 1, 2026',
            description: 'Spectacular penthouse with 360-degree views of the city. This exclusive property features floor-to-ceiling windows, a private rooftop terrace, and premium finishes throughout. The ultimate in urban luxury living.',
            amenities: ['Rooftop Terrace', 'Swimming Pool', 'Gym', 'Parking', 'Security', 'Air Conditioning', 'Smart Home'],
            submitted: 'Jan 8, 2026 at 11:30 AM',
            status: 'changes-requested',
            notes: 'Please provide higher resolution images and update the floor plan to show accurate room dimensions. Also, clarify the parking arrangement - is it covered or open?'
        },
        'approval-6': {
            id: '#LST-2024-006',
            name: 'Budget Studio',
            owner: 'Robert Zimba',
            ownerEmail: 'robert.z@example.com',
            ownerPhone: '+263 77 678 9012',
            images: ['assets/images/property2.jpg'],
            type: 'Family Homes',
            location: 'Mbare, Harare',
            price: '$350/mo',
            bedrooms: 1,
            bathrooms: 1,
            size: '400 sq ft',
            furnished: 'No',
            available: 'Immediately',
            description: 'Compact studio unit suitable for single occupancy. Basic amenities included.',
            amenities: ['Water', 'Electricity'],
            submitted: 'Jan 5, 2026 at 3:15 PM',
            status: 'rejected',
            notes: 'Listing does not meet minimum quality standards. Images are blurry and description lacks detail. Property does not appear to meet safety requirements. Please address these issues and resubmit.'
        }
    };

    // Filter rows based on status and search
    function filterRows() {
        const rows = tableBody.querySelectorAll('.admin-approvals__row');
        let visibleCount = 0;

        rows.forEach(row => {
            const status = row.dataset.status;
            const propertyName = row.querySelector('.admin-approvals__property-name')?.textContent.toLowerCase() || '';
            const ownerName = row.querySelector('.admin-approvals__owner-name')?.textContent.toLowerCase() || '';
            const searchText = currentSearch.toLowerCase();

            const matchesFilter = currentFilter === 'all' || status === currentFilter;
            const matchesSearch = !searchText || propertyName.includes(searchText) || ownerName.includes(searchText);

            if (matchesFilter && matchesSearch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Show/hide empty state
        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
        }

        // Show/hide table
        const tableContainer = document.querySelector('.admin-approvals__table-container');
        if (tableContainer) {
            tableContainer.style.display = visibleCount === 0 ? 'none' : 'block';
        }
    }

    // Handle filter button clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('admin-approvals__filter--active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('admin-approvals__filter--active');
            button.setAttribute('aria-selected', 'true');

            currentFilter = button.dataset.filter;
            filterRows();
        });
    });

    // Handle search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterRows();
        });
    }

    // Open approval modal
    function openApprovalModal(listingId, action) {
        if (!modal) return;

        currentListingId = listingId;
        currentAction = action;

        const listing = listingData[listingId];
        if (!listing) return;

        // Update modal content based on action
        if (modalThumbnail) modalThumbnail.src = listing.thumbnail;
        if (modalListingName) modalListingName.textContent = listing.name;
        if (modalListingOwner) modalListingOwner.textContent = `Owner: ${listing.owner}`;

        // Configure modal based on action type
        switch (action) {
            case 'approve':
                if (modalTitle) modalTitle.textContent = 'Approve Listing';
                if (modalCommentLabel) modalCommentLabel.textContent = 'Add a comment (optional)';
                if (modalCommentHint) modalCommentHint.textContent = 'Optional message to send to the property owner.';
                if (modalConfirm) {
                    modalConfirm.textContent = 'Approve Listing';
                    modalConfirm.className = 'btn btn--primary';
                }
                break;
            case 'changes':
                if (modalTitle) modalTitle.textContent = 'Request Changes';
                if (modalCommentLabel) modalCommentLabel.textContent = 'What changes are needed? (required)';
                if (modalCommentHint) modalCommentHint.textContent = 'Describe the changes the owner needs to make before approval.';
                if (modalConfirm) {
                    modalConfirm.textContent = 'Request Changes';
                    modalConfirm.className = 'btn btn--secondary';
                }
                break;
            case 'reject':
                if (modalTitle) modalTitle.textContent = 'Reject Listing';
                if (modalCommentLabel) modalCommentLabel.textContent = 'Reason for rejection (required)';
                if (modalCommentHint) modalCommentHint.textContent = 'Explain why this listing is being rejected.';
                if (modalConfirm) {
                    modalConfirm.textContent = 'Reject Listing';
                    modalConfirm.className = 'btn btn--danger';
                }
                break;
        }

        // Clear previous comment
        if (modalComment) modalComment.value = '';

        // Show modal
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus on comment field
        if (modalComment) modalComment.focus();
    }

    // Close approval modal
    function closeApprovalModal() {
        if (!modal) return;

        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        currentListingId = null;
        currentAction = null;
    }

    // Handle modal confirm action
    function handleConfirmAction() {
        const comment = modalComment ? modalComment.value.trim() : '';

        // Validate required fields
        if ((currentAction === 'changes' || currentAction === 'reject') && !comment) {
            alert('Please provide a reason or feedback for this action.');
            if (modalComment) modalComment.focus();
            return;
        }

        // Find the row and update status
        const row = tableBody.querySelector(`[data-listing-id="${currentListingId}"]`);
        if (row) {
            const statusCell = row.querySelector('.admin-approvals__status');
            const actionsCell = row.querySelector('.admin-approvals__actions');

            switch (currentAction) {
                case 'approve':
                    row.dataset.status = 'approved';
                    if (statusCell) {
                        statusCell.className = 'admin-approvals__status admin-approvals__status--approved';
                        statusCell.textContent = 'Approved';
                    }
                    if (actionsCell) {
                        actionsCell.innerHTML = '<button class="btn btn--small btn--secondary" onclick="viewListingDetails(\'' + currentListingId + '\')">View</button>';
                    }
                    break;
                case 'changes':
                    row.dataset.status = 'changes-requested';
                    if (statusCell) {
                        statusCell.className = 'admin-approvals__status admin-approvals__status--changes';
                        statusCell.textContent = 'Changes Requested';
                    }
                    if (actionsCell) {
                        actionsCell.innerHTML = '<button class="btn btn--small btn--secondary" onclick="viewListingDetails(\'' + currentListingId + '\')">View Notes</button>';
                    }
                    break;
                case 'reject':
                    row.dataset.status = 'rejected';
                    if (statusCell) {
                        statusCell.className = 'admin-approvals__status admin-approvals__status--rejected';
                        statusCell.textContent = 'Rejected';
                    }
                    if (actionsCell) {
                        actionsCell.innerHTML = '<button class="btn btn--small btn--secondary" onclick="viewListingDetails(\'' + currentListingId + '\')">View Reason</button>';
                    }
                    break;
            }

            // Update counts
            updateStatusCounts();
        }

        // Close modal and show success message
        closeApprovalModal();

        const actionMessages = {
            'approve': 'Listing has been approved successfully.',
            'changes': 'Change request has been sent to the owner.',
            'reject': 'Listing has been rejected.'
        };

        // Simple notification (could be enhanced with a toast component)
        console.log(actionMessages[currentAction], 'Comment:', comment);
    }

    // Update status counts in filters and stats
    function updateStatusCounts() {
        const rows = tableBody.querySelectorAll('.admin-approvals__row');
        const counts = {
            all: rows.length,
            pending: 0,
            approved: 0,
            'changes-requested': 0,
            rejected: 0
        };

        rows.forEach(row => {
            const status = row.dataset.status;
            if (counts[status] !== undefined) {
                counts[status]++;
            }
        });

        // Update filter button counts
        filterButtons.forEach(button => {
            const filter = button.dataset.filter;
            const countEl = button.querySelector('.admin-approvals__filter-count');
            if (countEl && counts[filter] !== undefined) {
                countEl.textContent = counts[filter];
            }
        });

        // Update stat cards
        const pendingCount = document.getElementById('pending-count');
        const approvedCount = document.getElementById('approved-count');
        const changesCount = document.getElementById('changes-count');
        const rejectedCount = document.getElementById('rejected-count');

        if (pendingCount) pendingCount.textContent = counts.pending;
        if (approvedCount) approvedCount.textContent = counts.approved;
        if (changesCount) changesCount.textContent = counts['changes-requested'];
        if (rejectedCount) rejectedCount.textContent = counts.rejected;
    }

    // Event listeners for approval modal
    if (modalCancel) {
        modalCancel.addEventListener('click', closeApprovalModal);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeApprovalModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeApprovalModal);
    }

    if (modalConfirm) {
        modalConfirm.addEventListener('click', handleConfirmAction);
    }

    // Expose functions globally for onclick handlers
    window.openApprovalModal = openApprovalModal;

    // Initial count update
    updateStatusCounts();

    // =====================================================
    // Review Modal Functionality
    // =====================================================
    const reviewModal = document.getElementById('review-modal');
    const reviewModalClose = document.getElementById('review-modal-close');
    const reviewModalCancel = document.getElementById('review-modal-cancel');
    const reviewModalBackdrop = reviewModal ? reviewModal.querySelector('.modal__backdrop') : null;
    const reviewModalApprove = document.getElementById('review-modal-approve');
    const reviewModalChanges = document.getElementById('review-modal-changes');
    const reviewModalReject = document.getElementById('review-modal-reject');
    const reviewModalActions = document.getElementById('review-modal-actions');
    const reviewModalEditNotes = document.getElementById('review-modal-edit-notes');

    // Carousel elements
    const carouselTrack = document.getElementById('review-carousel-track');
    const carouselPrev = document.getElementById('review-carousel-prev');
    const carouselNext = document.getElementById('review-carousel-next');
    const carouselCounter = document.getElementById('review-carousel-counter');
    const carouselIndicators = document.getElementById('review-carousel-indicators');

    let currentCarouselIndex = 0;
    let currentReviewListingId = null;
    let carouselImages = [];

    // Open review modal
    function viewListingDetails(listingId) {
        const listing = listingData[listingId];
        if (!listing || !reviewModal) return;

        currentReviewListingId = listingId;

        // Update status badge
        const statusEl = document.getElementById('review-modal-status');
        if (statusEl) {
            statusEl.textContent = getStatusLabel(listing.status);
            statusEl.className = 'review-modal__status';
            if (listing.status === 'approved') statusEl.classList.add('review-modal__status--approved');
            else if (listing.status === 'changes-requested') statusEl.classList.add('review-modal__status--changes');
            else if (listing.status === 'rejected') statusEl.classList.add('review-modal__status--rejected');
        }

        // Update basic info
        const nameEl = document.getElementById('review-modal-name');
        const priceEl = document.getElementById('review-modal-price');
        const locationEl = document.getElementById('review-modal-location');
        const idEl = document.getElementById('review-modal-id');

        if (nameEl) nameEl.textContent = listing.name;
        if (priceEl) priceEl.textContent = listing.price;
        if (locationEl) {
            const locationSpan = locationEl.querySelector('span');
            if (locationSpan) locationSpan.textContent = listing.location;
        }
        if (idEl) idEl.textContent = listing.id;

        // Update specs
        document.getElementById('review-modal-type').textContent = listing.type;
        document.getElementById('review-modal-bedrooms').textContent = listing.bedrooms;
        document.getElementById('review-modal-bathrooms').textContent = listing.bathrooms;
        document.getElementById('review-modal-size').textContent = listing.size;
        document.getElementById('review-modal-furnished').textContent = listing.furnished;
        document.getElementById('review-modal-available').textContent = listing.available;

        // Update description
        const descEl = document.getElementById('review-modal-description');
        if (descEl) descEl.textContent = listing.description;

        // Update amenities
        const amenitiesEl = document.getElementById('review-modal-amenities');
        if (amenitiesEl) {
            amenitiesEl.innerHTML = listing.amenities.map(a =>
                `<span class="review-modal__amenity">${a}</span>`
            ).join('');
        }

        // Update owner info
        const ownerInitials = document.getElementById('review-modal-owner-initials');
        const ownerName = document.getElementById('review-modal-owner-name');
        const ownerEmail = document.getElementById('review-modal-owner-email');
        const ownerPhone = document.getElementById('review-modal-owner-phone');

        if (ownerInitials) ownerInitials.textContent = getInitials(listing.owner);
        if (ownerName) ownerName.textContent = listing.owner;
        if (ownerEmail) ownerEmail.textContent = listing.ownerEmail;
        if (ownerPhone) ownerPhone.textContent = listing.ownerPhone;

        // Update submission info
        const submittedEl = document.getElementById('review-modal-submitted');
        if (submittedEl) submittedEl.textContent = listing.submitted;

        // Update notes section
        const notesSection = document.getElementById('review-modal-notes-section');
        const notesText = document.getElementById('review-modal-notes');
        if (listing.notes && listing.notes.length > 0) {
            if (notesSection) notesSection.style.display = 'block';
            if (notesText) notesText.textContent = listing.notes;
        } else {
            if (notesSection) notesSection.style.display = 'none';
        }

        // Update action buttons visibility based on status
        if (reviewModalActions) {
            if (listing.status === 'pending') {
                reviewModalActions.style.display = 'flex';
            } else {
                reviewModalActions.style.display = 'none';
            }
        }

        // Setup carousel
        setupCarousel(listing.images);

        // Show modal
        reviewModal.style.display = 'flex';
        reviewModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    // Get status label
    function getStatusLabel(status) {
        const labels = {
            'pending': 'Pending Review',
            'approved': 'Approved',
            'changes-requested': 'Changes Requested',
            'rejected': 'Rejected'
        };
        return labels[status] || status;
    }

    // Get initials from name
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    // Setup carousel
    function setupCarousel(images) {
        carouselImages = images;
        currentCarouselIndex = 0;

        if (!carouselTrack) return;

        // Create slides
        carouselTrack.innerHTML = images.map((img, i) =>
            `<div class="review-carousel__slide">
                <img src="${img}" alt="Property image ${i + 1}">
            </div>`
        ).join('');

        // Create indicators
        if (carouselIndicators) {
            carouselIndicators.innerHTML = images.map((_, i) =>
                `<button class="review-carousel__indicator${i === 0 ? ' review-carousel__indicator--active' : ''}"
                         type="button"
                         aria-label="Go to slide ${i + 1}"
                         data-index="${i}"></button>`
            ).join('');

            // Add click handlers to indicators
            carouselIndicators.querySelectorAll('.review-carousel__indicator').forEach(indicator => {
                indicator.addEventListener('click', () => {
                    goToSlide(parseInt(indicator.dataset.index));
                });
            });
        }

        // Update counter
        updateCarouselCounter();

        // Show/hide nav buttons based on number of images
        if (images.length <= 1) {
            if (carouselPrev) carouselPrev.style.display = 'none';
            if (carouselNext) carouselNext.style.display = 'none';
            if (carouselIndicators) carouselIndicators.style.display = 'none';
        } else {
            if (carouselPrev) carouselPrev.style.display = 'flex';
            if (carouselNext) carouselNext.style.display = 'flex';
            if (carouselIndicators) carouselIndicators.style.display = 'flex';
        }
    }

    // Go to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= carouselImages.length) return;
        currentCarouselIndex = index;

        if (carouselTrack) {
            carouselTrack.style.transform = `translateX(-${index * 100}%)`;
        }

        // Update indicators
        if (carouselIndicators) {
            carouselIndicators.querySelectorAll('.review-carousel__indicator').forEach((indicator, i) => {
                indicator.classList.toggle('review-carousel__indicator--active', i === index);
            });
        }

        updateCarouselCounter();
    }

    // Update carousel counter
    function updateCarouselCounter() {
        if (carouselCounter) {
            carouselCounter.textContent = `${currentCarouselIndex + 1} / ${carouselImages.length}`;
        }
    }

    // Carousel navigation
    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => {
            const newIndex = currentCarouselIndex > 0 ? currentCarouselIndex - 1 : carouselImages.length - 1;
            goToSlide(newIndex);
        });
    }

    if (carouselNext) {
        carouselNext.addEventListener('click', () => {
            const newIndex = currentCarouselIndex < carouselImages.length - 1 ? currentCarouselIndex + 1 : 0;
            goToSlide(newIndex);
        });
    }

    // Close review modal
    function closeReviewModal() {
        if (!reviewModal) return;
        reviewModal.style.display = 'none';
        reviewModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        currentReviewListingId = null;
    }

    // Review modal event listeners
    if (reviewModalClose) {
        reviewModalClose.addEventListener('click', closeReviewModal);
    }

    if (reviewModalCancel) {
        reviewModalCancel.addEventListener('click', closeReviewModal);
    }

    if (reviewModalBackdrop) {
        reviewModalBackdrop.addEventListener('click', closeReviewModal);
    }

    // Action buttons from review modal
    if (reviewModalApprove) {
        reviewModalApprove.addEventListener('click', () => {
            closeReviewModal();
            openApprovalModal(currentReviewListingId, 'approve');
        });
    }

    if (reviewModalChanges) {
        reviewModalChanges.addEventListener('click', () => {
            closeReviewModal();
            openApprovalModal(currentReviewListingId, 'changes');
        });
    }

    if (reviewModalReject) {
        reviewModalReject.addEventListener('click', () => {
            closeReviewModal();
            openApprovalModal(currentReviewListingId, 'reject');
        });
    }

    // =====================================================
    // Notes Edit Modal Functionality
    // =====================================================
    const notesModal = document.getElementById('notes-modal');
    const notesModalClose = document.getElementById('notes-modal-close');
    const notesModalCancel = document.getElementById('notes-modal-cancel');
    const notesModalSave = document.getElementById('notes-modal-save');
    const notesModalRemove = document.getElementById('notes-modal-remove');
    const notesModalBackdrop = notesModal ? notesModal.querySelector('.modal__backdrop') : null;
    const notesContent = document.getElementById('notes-content');
    const notesModalListingName = document.getElementById('notes-modal-listing-name');
    const notesModalListingStatus = document.getElementById('notes-modal-listing-status');

    let currentNotesListingId = null;

    // Open notes modal
    function openNotesModal(listingId) {
        const listing = listingData[listingId];
        if (!listing || !notesModal) return;

        currentNotesListingId = listingId;

        // Update modal content
        if (notesModalListingName) notesModalListingName.textContent = listing.name;
        if (notesModalListingStatus) {
            notesModalListingStatus.textContent = getStatusLabel(listing.status);
            notesModalListingStatus.className = 'notes-modal__listing-status';
            if (listing.status === 'rejected') notesModalListingStatus.classList.add('notes-modal__listing-status--rejected');
        }
        if (notesContent) notesContent.value = listing.notes || '';

        // Show modal
        notesModal.style.display = 'flex';
        notesModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (notesContent) notesContent.focus();
    }

    // Close notes modal
    function closeNotesModal() {
        if (!notesModal) return;
        notesModal.style.display = 'none';
        notesModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        currentNotesListingId = null;
    }

    // Save notes
    function saveNotes() {
        if (!currentNotesListingId || !notesContent) return;

        const listing = listingData[currentNotesListingId];
        if (listing) {
            listing.notes = notesContent.value.trim();
            console.log('Notes saved for', listing.name, ':', listing.notes);
        }

        closeNotesModal();

        // If review modal is open, refresh the notes section
        if (reviewModal && reviewModal.getAttribute('aria-hidden') === 'false') {
            const notesSection = document.getElementById('review-modal-notes-section');
            const notesText = document.getElementById('review-modal-notes');
            if (listing.notes && listing.notes.length > 0) {
                if (notesSection) notesSection.style.display = 'block';
                if (notesText) notesText.textContent = listing.notes;
            } else {
                if (notesSection) notesSection.style.display = 'none';
            }
        }
    }

    // Remove notes
    function removeNotes() {
        if (!currentNotesListingId) return;

        if (confirm('Are you sure you want to remove these notes?')) {
            const listing = listingData[currentNotesListingId];
            if (listing) {
                listing.notes = '';
                console.log('Notes removed for', listing.name);
            }

            closeNotesModal();

            // If review modal is open, hide the notes section
            if (reviewModal && reviewModal.getAttribute('aria-hidden') === 'false') {
                const notesSection = document.getElementById('review-modal-notes-section');
                if (notesSection) notesSection.style.display = 'none';
            }
        }
    }

    // Notes modal event listeners
    if (notesModalClose) {
        notesModalClose.addEventListener('click', closeNotesModal);
    }

    if (notesModalCancel) {
        notesModalCancel.addEventListener('click', closeNotesModal);
    }

    if (notesModalBackdrop) {
        notesModalBackdrop.addEventListener('click', closeNotesModal);
    }

    if (notesModalSave) {
        notesModalSave.addEventListener('click', saveNotes);
    }

    if (notesModalRemove) {
        notesModalRemove.addEventListener('click', removeNotes);
    }

    // Edit notes from review modal
    if (reviewModalEditNotes) {
        reviewModalEditNotes.addEventListener('click', () => {
            if (currentReviewListingId) {
                openNotesModal(currentReviewListingId);
            }
        });
    }

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (notesModal && notesModal.getAttribute('aria-hidden') === 'false') {
                closeNotesModal();
            } else if (reviewModal && reviewModal.getAttribute('aria-hidden') === 'false') {
                closeReviewModal();
            } else if (modal && modal.getAttribute('aria-hidden') === 'false') {
                closeApprovalModal();
            }
        }
    });

    // Expose functions globally
    window.viewListingDetails = viewListingDetails;
    window.openNotesModal = openNotesModal;
})();

// Property Upload Module
(function() {
    const form = document.getElementById('property-upload-form');
    if (!form) return;

    // DOM Elements
    const propertyNameInput = document.getElementById('property-name');
    const propertyTypeInput = document.getElementById('property-type');
    const propertyLocationInput = document.getElementById('property-location');
    const propertyPriceInput = document.getElementById('property-price');
    const ownerNameInput = document.getElementById('owner-name');
    const ownerEmailInput = document.getElementById('owner-email');
    const propertyBedroomsSelect = document.getElementById('property-bedrooms');
    const propertyBathroomsSelect = document.getElementById('property-bathrooms');
    const propertyFurnishedSelect = document.getElementById('property-furnished');
    const propertyDescriptionInput = document.getElementById('property-description');
    const propertyImagesInput = document.getElementById('property-images');
    const imageDropzone = document.getElementById('image-dropzone');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const progressBar = document.getElementById('upload-progress-bar');
    const progressText = document.getElementById('upload-progress-text');
    const typeButtons = document.querySelectorAll('.property-upload__type-btn');
    const clearBtn = document.getElementById('upload-clear-btn');
    const submitBtn = document.getElementById('upload-submit-btn');
    const saveAddAnotherBtn = document.getElementById('upload-save-add-another');
    const recentUploadsSection = document.getElementById('recent-uploads-section');
    const recentUploadsList = document.getElementById('recent-uploads-list');
    const recentUploadsEmpty = document.getElementById('recent-uploads-empty');
    const recentUploadCount = document.getElementById('recent-upload-count');
    const uploadCountToday = document.getElementById('upload-count-today');
    const uploadCountPending = document.getElementById('upload-count-pending');

    // State
    let selectedImages = [];
    let recentUploads = [];
    const REQUIRED_FIELDS = ['propertyName', 'propertyType', 'location', 'price', 'ownerName', 'ownerEmail'];

    // Initialize
    function init() {
        setupTypeButtons();
        setupImageUpload();
        setupFormValidation();
        setupFormActions();
        updateProgress();
        loadRecentUploads();
    }

    // Property Type Button Selection
    function setupTypeButtons() {
        typeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Deselect all
                typeButtons.forEach(b => {
                    b.classList.remove('property-upload__type-btn--selected');
                    b.setAttribute('aria-checked', 'false');
                });
                // Select clicked
                btn.classList.add('property-upload__type-btn--selected');
                btn.setAttribute('aria-checked', 'true');
                propertyTypeInput.value = btn.dataset.type;
                updateProgress();
            });
        });
    }

    // Image Upload Handling
    function setupImageUpload() {
        // Dropzone click
        imageDropzone.addEventListener('click', () => {
            propertyImagesInput.click();
        });

        // Dropzone keyboard
        imageDropzone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                propertyImagesInput.click();
            }
        });

        // File input change
        propertyImagesInput.addEventListener('change', handleImageSelect);

        // Drag and drop
        imageDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageDropzone.classList.add('property-upload__dropzone--active');
        });

        imageDropzone.addEventListener('dragleave', () => {
            imageDropzone.classList.remove('property-upload__dropzone--active');
        });

        imageDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageDropzone.classList.remove('property-upload__dropzone--active');
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            addImages(files);
        });
    }

    function handleImageSelect(e) {
        const files = Array.from(e.target.files);
        addImages(files);
    }

    function addImages(files) {
        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`Image "${file.name}" is too large. Maximum size is 10MB.`);
                return;
            }
            if (!selectedImages.some(img => img.name === file.name && img.size === file.size)) {
                selectedImages.push(file);
            }
        });
        renderImagePreviews();
        updateProgress();
    }

    function renderImagePreviews() {
        imagePreviewContainer.innerHTML = '';

        if (selectedImages.length > 0) {
            imageDropzone.classList.add('property-upload__dropzone--has-files');
        } else {
            imageDropzone.classList.remove('property-upload__dropzone--has-files');
        }

        selectedImages.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const item = document.createElement('div');
                item.className = 'property-upload__preview-item';
                item.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="property-upload__preview-remove" data-index="${index}" aria-label="Remove image">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                `;
                imagePreviewContainer.appendChild(item);

                // Add remove handler
                item.querySelector('.property-upload__preview-remove').addEventListener('click', () => {
                    removeImage(index);
                });
            };
            reader.readAsDataURL(file);
        });
    }

    function removeImage(index) {
        selectedImages.splice(index, 1);
        renderImagePreviews();
        updateProgress();
    }

    // Form Validation & Progress
    function setupFormValidation() {
        const inputs = [propertyNameInput, propertyLocationInput, propertyPriceInput, ownerNameInput, ownerEmailInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', updateProgress);
                input.addEventListener('blur', validateField);
            }
        });
    }

    function validateField(e) {
        const input = e.target;
        const value = input.value.trim();

        if (input.required && !value) {
            input.classList.add('property-upload__input--error');
        } else {
            input.classList.remove('property-upload__input--error');
        }

        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('property-upload__input--error');
            }
        }
    }

    function updateProgress() {
        let filledCount = 0;
        const totalRequired = 6; // name, type, location, price, owner name, owner email

        if (propertyNameInput && propertyNameInput.value.trim()) filledCount++;
        if (propertyTypeInput && propertyTypeInput.value) filledCount++;
        if (propertyLocationInput && propertyLocationInput.value.trim()) filledCount++;
        if (propertyPriceInput && propertyPriceInput.value) filledCount++;
        if (ownerNameInput && ownerNameInput.value.trim()) filledCount++;
        if (ownerEmailInput && ownerEmailInput.value.trim()) filledCount++;

        const percentage = (filledCount / totalRequired) * 100;

        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        if (progressText) {
            progressText.textContent = `${filledCount} / ${totalRequired} fields`;
        }

        // Enable/disable submit button
        if (submitBtn) {
            submitBtn.disabled = filledCount < totalRequired;
        }
        if (saveAddAnotherBtn) {
            saveAddAnotherBtn.disabled = filledCount < totalRequired;
        }
    }

    // Form Actions
    function setupFormActions() {
        // Form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitForm(false);
        });

        // Clear button
        if (clearBtn) {
            clearBtn.addEventListener('click', clearForm);
        }

        // Save and add another
        if (saveAddAnotherBtn) {
            saveAddAnotherBtn.addEventListener('click', () => {
                submitForm(true);
            });
        }
    }

    function submitForm(addAnother) {
        // Validate
        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = {
            id: 'LST-' + Date.now(),
            propertyName: propertyNameInput.value.trim(),
            propertyType: propertyTypeInput.value,
            location: propertyLocationInput.value.trim(),
            price: propertyPriceInput.value,
            bedrooms: propertyBedroomsSelect ? propertyBedroomsSelect.value : '',
            bathrooms: propertyBathroomsSelect ? propertyBathroomsSelect.value : '',
            furnished: propertyFurnishedSelect ? propertyFurnishedSelect.value : '',
            ownerName: ownerNameInput.value.trim(),
            ownerEmail: ownerEmailInput.value.trim(),
            description: propertyDescriptionInput ? propertyDescriptionInput.value.trim() : '',
            images: selectedImages.length,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
        }

        // Simulate API call
        setTimeout(() => {
            // Add to recent uploads
            recentUploads.unshift(formData);
            saveRecentUploads();
            updateStats();
            renderRecentUploads();

            // Show success
            showSuccessMessage(formData.propertyName);

            // Reset form
            if (addAnother) {
                clearForm();
                if (propertyNameInput) {
                    propertyNameInput.focus();
                }
            } else {
                clearForm();
            }

            // Reset button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span class="property-upload__btn-text">Submit for Approval</span>
                    <svg class="property-upload__btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        }, 800);
    }

    function validateForm() {
        let isValid = true;
        const fields = [
            { input: propertyNameInput, name: 'Property Name' },
            { input: propertyTypeInput, name: 'Property Type' },
            { input: propertyLocationInput, name: 'Location' },
            { input: propertyPriceInput, name: 'Price' },
            { input: ownerNameInput, name: 'Owner Name' },
            { input: ownerEmailInput, name: 'Owner Email' }
        ];

        fields.forEach(field => {
            if (field.input && !field.input.value.trim()) {
                field.input.classList.add('property-upload__input--error');
                isValid = false;
            }
        });

        // Validate email format
        if (ownerEmailInput && ownerEmailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(ownerEmailInput.value)) {
                ownerEmailInput.classList.add('property-upload__input--error');
                isValid = false;
            }
        }

        return isValid;
    }

    function clearForm() {
        form.reset();
        selectedImages = [];
        renderImagePreviews();

        // Clear type selection
        typeButtons.forEach(btn => {
            btn.classList.remove('property-upload__type-btn--selected');
            btn.setAttribute('aria-checked', 'false');
        });
        if (propertyTypeInput) {
            propertyTypeInput.value = '';
        }

        // Clear error states
        form.querySelectorAll('.property-upload__input--error').forEach(el => {
            el.classList.remove('property-upload__input--error');
        });

        updateProgress();
    }

    function showSuccessMessage(propertyName) {
        const overlay = document.createElement('div');
        overlay.className = 'property-upload__success-overlay';
        overlay.innerHTML = `
            <div class="property-upload__success-content">
                <div class="property-upload__success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="property-upload__success-title">Property Submitted!</h3>
                <p class="property-upload__success-message">"${propertyName}" has been submitted for approval.</p>
            </div>
        `;
        document.body.appendChild(overlay);

        // Auto remove after 2 seconds
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }, 1500);
    }

    // Recent Uploads Management
    function loadRecentUploads() {
        try {
            const stored = localStorage.getItem('lendaz_recent_uploads');
            if (stored) {
                recentUploads = JSON.parse(stored);
                // Filter to only today's uploads
                const today = new Date().toDateString();
                recentUploads = recentUploads.filter(upload => {
                    const uploadDate = new Date(upload.submittedAt).toDateString();
                    return uploadDate === today;
                });
            }
        } catch (e) {
            recentUploads = [];
        }
        updateStats();
        renderRecentUploads();
    }

    function saveRecentUploads() {
        try {
            localStorage.setItem('lendaz_recent_uploads', JSON.stringify(recentUploads.slice(0, 50)));
        } catch (e) {
            console.warn('Could not save recent uploads to localStorage');
        }
    }

    function updateStats() {
        if (uploadCountToday) {
            uploadCountToday.textContent = recentUploads.length;
        }
        if (uploadCountPending) {
            const pendingCount = recentUploads.filter(u => u.status === 'pending').length;
            uploadCountPending.textContent = pendingCount;
        }
        if (recentUploadCount) {
            recentUploadCount.textContent = recentUploads.length + ' today';
        }
    }

    function renderRecentUploads() {
        if (!recentUploadsList) return;

        if (recentUploads.length === 0) {
            if (recentUploadsEmpty) {
                recentUploadsEmpty.style.display = 'block';
            }
            return;
        }

        if (recentUploadsEmpty) {
            recentUploadsEmpty.style.display = 'none';
        }

        // Clear existing items (except empty state)
        const existingItems = recentUploadsList.querySelectorAll('.property-upload__recent-item');
        existingItems.forEach(item => item.remove());

        // Render recent uploads
        recentUploads.slice(0, 5).forEach(upload => {
            const item = document.createElement('div');
            item.className = 'property-upload__recent-item';

            const time = new Date(upload.submittedAt);
            const timeString = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

            item.innerHTML = `
                <div class="property-upload__recent-thumb" style="background: linear-gradient(135deg, var(--color-gray-200), var(--color-gray-300));"></div>
                <div class="property-upload__recent-info">
                    <div class="property-upload__recent-name">${upload.propertyName}</div>
                    <div class="property-upload__recent-meta">${upload.propertyType} &bull; ${upload.location} &bull; ${timeString}</div>
                </div>
                <span class="property-upload__recent-status">Pending</span>
            `;

            recentUploadsList.insertBefore(item, recentUploadsEmpty);
        });
    }

    // Initialize module
    init();
})();

// End of DOMContentLoaded
});




















// ===== APP STATE MANAGEMENT =====
const app = {
    bluetoothConnected: false,
    bluetoothDevice: null,
    bluetoothPermissionGranted: false,
    emergencyContacts: [],
    alertLogs: [],
    settings: {
        vibrationSensitivity: 500,
        alertDelay: 3,
        autoSms: true,
        gpsUpdateInterval: 5,
        alertSound: 'default'
    },
    currentLocation: {
        lat: 0,
        lon: 0,
        lastUpdate: 'Never'
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromStorage();
    updateDashboard();
    renderContacts();
    renderAlertLogs();
    initializeApp();
});

function initializeApp() {
    // Try to request Bluetooth permission on first load
    if (!app.bluetoothPermissionGranted) {
        console.log('Bluetooth permission not yet granted');
    }

    // Load saved data
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
        app.emergencyContacts = JSON.parse(savedContacts);
        renderContacts();
    }

    const savedLogs = localStorage.getItem('alertLogs');
    if (savedLogs) {
        app.alertLogs = JSON.parse(savedLogs);
        renderAlertLogs();
    }

    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
        app.settings = JSON.parse(savedSettings);
        document.getElementById('sensitivitySlider').value = app.settings.vibrationSensitivity;
        document.getElementById('sensValue').textContent = app.settings.vibrationSensitivity;
        document.getElementById('delaySlider').value = app.settings.alertDelay;
        document.getElementById('delayValue').textContent = app.settings.alertDelay;
    }
}

// ===== DATA PERSISTENCE =====
function saveDataToStorage() {
    localStorage.setItem('emergencyContacts', JSON.stringify(app.emergencyContacts));
    localStorage.setItem('alertLogs', JSON.stringify(app.alertLogs));
    localStorage.setItem('settings', JSON.stringify(app.settings));
}

function loadDataFromStorage() {
    const contacts = localStorage.getItem('emergencyContacts');
    const logs = localStorage.getItem('alertLogs');
    const settings = localStorage.getItem('settings');

    if (contacts) app.emergencyContacts = JSON.parse(contacts);
    if (logs) app.alertLogs = JSON.parse(logs);
    if (settings) app.settings = { ...app.settings, ...JSON.parse(settings) };
}

// ===== VIEW NAVIGATION =====
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Hide all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected view
    document.getElementById(viewName).classList.add('active');

    // Highlight nav item
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
}

// ===== DASHBOARD FUNCTIONS =====
function updateDashboard() {
    // Update connection status
    const connectionStatus = document.getElementById('connectionStatus');
    const connectionText = document.getElementById('connectionText');
    const statusBadge = document.getElementById('statusBadge');

    if (app.bluetoothConnected) {
        connectionStatus.textContent = 'âœ…';
        connectionText.textContent = `Connected: ${app.bluetoothDevice}`;
        statusBadge.textContent = 'CONNECTED';
        statusBadge.className = 'status-badge connected';
    } else {
        connectionStatus.textContent = 'âŒ';
        connectionText.textContent = 'Not Connected';
        statusBadge.textContent = 'DISCONNECTED';
        statusBadge.className = 'status-badge disconnected';
    }

    // Update contact count
    document.getElementById('contactCount').textContent = app.emergencyContacts.length;

    // Update GPS status
    const gpsStatus = document.getElementById('gpsStatus');
    gpsStatus.textContent = app.currentLocation.lat === 0 ? 'â³' : 'âœ…';
}

function renderContacts() {
    const contactsList = document.getElementById('contactsList');
    const contactsCount = document.getElementById('contactsCount');

    contactsCount.textContent = `${app.emergencyContacts.length}/5`;

    if (app.emergencyContacts.length === 0) {
        contactsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">ðŸ‘¥</div>
                <div>No contacts added yet</div>
            </div>
        `;
        return;
    }

    contactsList.innerHTML = app.emergencyContacts.map((contact, index) => `
        <div class="contact-item">
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-phone">${contact.phone}</div>
            </div>
            ${index === 0 ? '<span class="contact-badge">PRIMARY</span>' : ''}
            <div class="contact-actions">
                <button class="btn btn-danger btn-small" onclick="deleteContact(${index})">ðŸ—‘ï¸</button>
            </div>
        </div>
    `).join('');
}

function renderAlertLogs() {
    const alertLogs = document.getElementById('alertLogs');
    const recentAlerts = document.getElementById('recentAlerts');

    if (app.alertLogs.length === 0) {
        alertLogs.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">ðŸ“­</div>
                <div>No alerts triggered yet</div>
            </div>
        `;
        recentAlerts.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">ðŸ“­</div>
                <div>No alerts yet</div>
            </div>
        `;
        return;
    }

    // Render all logs
    alertLogs.innerHTML = app.alertLogs.map((log, index) => `
        <div class="log-item">
            <div class="log-time">${log.timestamp}</div>
            <div class="log-location">ðŸ“ ${log.location || 'Unknown Location'}</div>
            <div class="log-location" style="font-size: 12px; color: #666;">
                Coords: ${log.lat}, ${log.lon}
            </div>
            <div style="margin-top: 8px;">
                <span class="log-status ${log.smsStatus === 'Success' ? 'success' : 'failed'}">
                    ${log.smsStatus}
                </span>
                <span style="font-size: 12px; color: #999; margin-left: 8px;">
                    ${log.recipients} recipients
                </span>
            </div>
        </div>
    `).join('');

    // Render recent alerts (last 3)
    const recent = app.alertLogs.slice(-3).reverse();
    recentAlerts.innerHTML = recent.map((log) => `
        <div class="card">
            <div style="font-weight: 600; margin-bottom: 8px;">${log.timestamp}</div>
            <div style="font-size: 14px; color: #666;">
                ðŸ“ ${log.location || 'Unknown'}
            </div>
            <div style="margin-top: 8px;">
                <span class="log-status ${log.smsStatus === 'Success' ? 'success' : 'failed'}" style="font-size: 12px;">
                    ${log.smsStatus}
                </span>
            </div>
        </div>
    `).join('');
}

// ===== BLUETOOTH FUNCTIONS =====
function showBluetoothModal() {
    document.getElementById('bluetoothModal').classList.add('active');
    // Request permission first
    document.getElementById('bluetoothPermission').style.display = 'flex';
    document.getElementById('bluetoothScanning').style.display = 'none';
    document.getElementById('bluetoothDevices').style.display = 'none';
    document.getElementById('bluetoothConnecting').style.display = 'none';
    document.getElementById('bluetoothSuccess').style.display = 'none';
}

function closeBluetoothModal() {
    document.getElementById('bluetoothModal').classList.remove('active');
    updateDashboard();
}

function allowBluetoothPermission() {
    app.bluetoothPermissionGranted = true;
    document.getElementById('bluetoothPermission').style.display = 'none';
    document.getElementById('bluetoothScanning').style.display = 'block';

    // Simulate device scanning
    setTimeout(() => {
        document.getElementById('bluetoothScanning').style.display = 'none';
        document.getElementById('bluetoothDevices').style.display = 'block';
    }, 2000);
}

function denyBluetoothPermission() {
    showNotification('Bluetooth permission denied', 'error');
    closeBluetoothModal();
}

function selectDevice(deviceName, deviceAddress) {
    app.bluetoothDevice = deviceName;
    document.getElementById('bluetoothDevices').style.display = 'none';
    document.getElementById('bluetoothConnecting').style.display = 'block';
    document.getElementById('connectingDevice').textContent = `Connecting to ${deviceName}...`;

    // Simulate connection
    setTimeout(() => {
        app.bluetoothConnected = true;
        document.getElementById('bluetoothConnecting').style.display = 'none';
        document.getElementById('bluetoothSuccess').style.display = 'block';
        document.getElementById('successDevice').textContent = `Connected to ${deviceName}!`;
        updateDashboard();
        generateArduinoCode();
    }, 1500);
}

// ===== CONTACT MANAGEMENT =====
function showContactModal() {
    if (app.emergencyContacts.length >= 5) {
        showNotification('Maximum 5 contacts allowed', 'warning');
        return;
    }
    document.getElementById('contactModal').classList.add('active');
    document.getElementById('contactModalTitle').textContent = 'Add Contact';
    document.getElementById('contactName').value = '';
    document.getElementById('contactPhone').value = '';
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('active');
}

function saveContact(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;

    if (!name || !phone) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    // Validate phone number format
    if (!/^\+\d{1,15}$/.test(phone)) {
        showNotification('Invalid phone number format (use +91XXXXXXXXXX)', 'error');
        return;
    }

    app.emergencyContacts.push({ name, phone });
    saveDataToStorage();
    sendContactToArduino(name, phone);
    renderContacts();
    closeContactModal();
    showNotification('Contact added successfully', 'success');
    generateArduinoCode();
    updateDashboard();
}

function deleteContact(index) {
    if (confirm('Are you sure you want to delete this contact?')) {
        app.emergencyContacts.splice(index, 1);
        saveDataToStorage();
        renderContacts();
        showNotification('Contact deleted', 'success');
        generateArduinoCode();
        updateDashboard();
    }
}

function sendContactToArduino(name, phone) {
    if (app.bluetoothConnected) {
        const command = `ADD_CONTACT:${name}:${phone}`;
        console.log('Sending to Arduino:', command);
        // Simulate Bluetooth send
        setTimeout(() => {
            showNotification('Contact sent to Arduino', 'success');
        }, 500);
    }
}

// ===== SETTINGS FUNCTIONS =====
function updateSensitivity(value) {
    app.settings.vibrationSensitivity = parseInt(value);
    document.getElementById('sensValue').textContent = value;
    saveDataToStorage();

    if (app.bluetoothConnected) {
        const command = `SET_SENSITIVITY:${value}`;
        console.log('Sending to Arduino:', command);
    }
}

function updateDelay(value) {
    app.settings.alertDelay = parseInt(value);
    document.getElementById('delayValue').textContent = value;
    saveDataToStorage();

    if (app.bluetoothConnected) {
        const command = `SET_DELAY:${value}`;
        console.log('Sending to Arduino:', command);
    }
}

function toggleAutoSms() {
    app.settings.autoSms = !app.settings.autoSms;
    document.getElementById('autoSmsToggle').classList.toggle('active');
    saveDataToStorage();
    showNotification(`Auto SMS ${app.settings.autoSms ? 'enabled' : 'disabled'}`, 'info');
}

function generateArduinoCode() {
    let code = '// Emergency Contacts Configuration\n';
    app.emergencyContacts.forEach((contact, index) => {
        code += `String contact${index + 1} = "${contact.phone}";\n`;
    });
    code += `\n// Settings\n`;
    code += `int vibrationThreshold = ${app.settings.vibrationSensitivity};\n`;
    code += `int alertDelay = ${app.settings.alertDelay};\n`;

    document.getElementById('arduinoCode').textContent = code;
}

function copyArduinoCode() {
    const codeText = document.getElementById('arduinoCode').textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        showNotification('Arduino code copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy code', 'error');
    });
}

// ===== ALERT FUNCTIONS =====
function testAlert() {
    if (app.emergencyContacts.length === 0) {
        showNotification('Please add emergency contacts first', 'warning');
        return;
    }

    // Simulate current location
    app.currentLocation.lat = 12.9716 + (Math.random() - 0.5) * 0.01;
    app.currentLocation.lon = 77.5946 + (Math.random() - 0.5) * 0.01;
    const now = new Date();
    app.currentLocation.lastUpdate = now.toLocaleTimeString();

    // Show alert banner
    const alertBanner = document.getElementById('alertBanner');
    const alertTime = document.getElementById('alertTime');
    const alertLocation = document.getElementById('alertLocation');
    const alertStatus = document.getElementById('alertStatus');

    alertTime.textContent = `Time: ${now.toLocaleString()}`;
    alertLocation.textContent = `ðŸ“ Lat: ${app.currentLocation.lat.toFixed(4)}, Lon: ${app.currentLocation.lon.toFixed(4)}`;
    alertStatus.textContent = `Sending SMS to ${app.emergencyContacts.length} recipients...`;

    alertBanner.style.display = 'block';
    setTimeout(() => {
        alertStatus.innerHTML = `âœ… SMS sent to ${app.emergencyContacts.length} recipients`;
    }, 2000);

    // Add to logs
    const log = {
        timestamp: now.toLocaleString(),
        location: 'Test Location',
        lat: app.currentLocation.lat.toFixed(6),
        lon: app.currentLocation.lon.toFixed(6),
        smsStatus: 'Success',
        recipients: app.emergencyContacts.length
    };

    app.alertLogs.push(log);
    saveDataToStorage();
    renderAlertLogs();

    // Hide alert after 5 seconds
    setTimeout(() => {
        alertBanner.style.display = 'none';
    }, 5000);

    updateDashboard();
    showNotification('Test alert sent successfully!', 'success');
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== UTILITY FUNCTIONS =====
function formatDate(date) {
    return new Date(date).toLocaleString();
}

function getRandomLocation() {
    return {
        lat: 12.9716 + (Math.random() - 0.5) * 0.01,
        lon: 77.5946 + (Math.random() - 0.5) * 0.01
    };
}

// Initialize on load
window.addEventListener('load', () => {
    initializeApp();
    generateArduinoCode();
});
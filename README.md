# smart-helmet
## Professional PWA Application for Arduino-based Smart Helmet

A comprehensive Progressive Web App for managing emergency contacts, tracking GPS location, and sending automated SMS alerts when vibration is detected on a motorcycle helmet.

### Features

âœ… **Bluetooth Connectivity**
- Connect to HC-05 Bluetooth module
- Real-time device status monitoring
- Automatic permission handling 

âœ… **Emergency Contact Management**
- Add/edit/delete up to 5 emergency contacts
- Primary contact designation
- Phone number validation
- Auto-generate Arduino code with contacts

âœ… **GPS Tracking**
- Real-time location monitoring
- Location history with timestamps
- Map view integration ready
- Coordinate display and updates

âœ… **Alert Management**
- Vibration detection sensitivity control
- Configurable alert delay (1-10 seconds)
- SMS delivery status tracking
- Complete alert history with filtering

âœ… **Settings Synchronization**
- Real-time Arduino configuration
- EEPROM persistence
- Settings auto-sync to hardware
- Arduino code generation

âœ… **Progressive Web App**
- Install on home screen
- Offline functionality
- Native app-like experience
- Works on iOS and Android

### Installation

#### Option 1: Direct Web Access
1. Open in any modern web browser
2. URL will be: `file:///path/to/smart_helmet_app.html`

#### Option 2: Install as PWA
**Android (Chrome):**
1. Open the app in Chrome
2. Tap menu (â‹®) â†’ "Add to Home screen"
3. App will appear on your home screen

**iOS (Safari):**
1. Open the app in Safari
2. Tap Share â†’ "Add to Home Screen"
3. App will appear on your home screen

### File Structure

```
smart_helmet_pro/
â”œâ”€â”€ smart_helmet_app.html      # Main app interface
â”œâ”€â”€ smart_helmet_app.js        # Application logic
â”œâ”€â”€ sw.js                      # Service Worker (offline support)
â”œâ”€â”€ manifest.json              # PWA configuration
â””â”€â”€ README.md                  # This file
```

### Hardware Requirements

- Arduino Uno microcontroller
- HC-05 Bluetooth module
- NEO-6M GPS module with antenna
- SW-420 Vibration sensor
- Power supplies (3.7-4.2V for HC-05, 5V for Arduino)
- Voltage divider resistors (1kÎ©, 2.2kÎ©)

### Arduino Setup

1. Install required libraries:
   - TinyGPS++
   - SoftwareSerial (usually pre-installed)

2. Configure Arduino pins:
   - GPS TX â†’ Pin 4
   - GPS RX â†’ Pin 3
   - HC-05 TX â†’ Pin 8
   - HC-05 RX â†’ Pin 7 (with voltage divider)
   - Vibration Sensor â†’ A5

3. Upload the provided Arduino sketch

4. Configure HC-05 using AT commands at 38400 baud:
   ```
   AT+NAME=SmartHelmet
   AT+PIN=1234
   AT+UART=9600,0,0
   ```

### Usage

1. **Connect Bluetooth**
   - Click "Connect Bluetooth" on home screen
   - Grant permission when prompted
   - Select HC-05 from device list
   - Connection confirmed with checkmark

2. **Add Emergency Contacts**
   - Go to "Contacts" tab
   - Click "Add New Contact"
   - Enter name and phone number in +91XXXXXXXXXX format
   - Save - contact automatically synced to Arduino

3. **Adjust Settings**
   - Go to "Settings" tab
   - Adjust vibration sensitivity (100-900)
   - Set alert delay (1-10 seconds)
   - Toggle auto SMS
   - Changes auto-sync to Arduino

4. **View Arduino Code**
   - In Settings, see auto-generated Arduino configuration
   - Click "Copy Code" to copy to clipboard
   - Paste into your Arduino sketch

5. **Test Alert**
   - Click "Test Alert" on home screen
   - View alert in history
   - Check SMS delivery status

### Contact Format

Phone numbers must be in international format:
- India: +91XXXXXXXXXX
- USA: +1XXXXXXXXXX
- Maximum 5 contacts per device

### Settings Reference

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Vibration Sensitivity | 100-900 | 500 | Threshold for detecting impact |
| Alert Delay | 1-10 sec | 3 sec | Wait time before sending alert |
| Auto SMS | On/Off | On | Automatically send SMS on alert |
| GPS Update | 5-30 sec | 5 sec | How often to update location |

### Troubleshooting

**Bluetooth not connecting?**
- Ensure HC-05 is powered (3.7-4.2V)
- Check if HC-05 LED is blinking
- Verify Bluetooth is enabled on phone
- Try removing and re-adding the device

**No GPS signal?**
- Move to open area with clear sky
- Ensure antenna is connected to GPS module
- Wait 3-5 minutes for cold start
- Check GPS LED blinking pattern

**SMS not sending?**
- Verify emergency contacts are added
- Check phone has SMS permissions enabled
- Ensure phone has active cellular connection
- Check Arduino is connected via Bluetooth

**Arduino code not updating?**
- Click "Copy Code" again
- Ensure Bluetooth is connected
- Manually upload code to Arduino
- Check EEPROM availability

### Security

- Bluetooth PIN: 1234 (change in AT commands if needed)
- Emergency contacts stored locally on device
- Alert logs kept in app cache
- No cloud connectivity required
- Privacy: All data stays on your device

### Browser Compatibility

âœ… Chrome/Edge (Android)
âœ… Safari (iOS 11.3+)
âœ… Firefox (Android)
âœ… Samsung Internet
âœ… All modern browsers with Service Worker support

### API Reference

### Bluetooth Commands Sent to Arduino:

```
ADD_CONTACT:name:+919876543210
REMOVE_CONTACT:0
SET_SENSITIVITY:500
SET_DELAY:3
GET_CONTACTS
GET_GPS
GET_STATUS
TEST_ALERT
```

### System Requirements

- Modern smartphone (Android 5.0+ or iOS 11.3+)
- Bluetooth LE capability
- Internet (for initial setup only)
- 5MB storage space

### Performance

- App size: ~50KB
- Memory usage: ~5-10MB
- Battery impact: Minimal (Bluetooth 4.2+)
- Offline capability: 100%
- Load time: <2 seconds

### Support

For issues or feature requests:
1. Check troubleshooting section
2. Verify Arduino connections
3. Review Arduino sketch compilation
4. Test with fresh phone Bluetooth pairing

### License

This application is provided as-is for educational and personal use.

### Version

**Smart Helmet Alert System v2.0.0**
- Responsive PWA interface
- Real-time Bluetooth sync
- Complete GPS integration
- Emergency contact management
- Alert history tracking

---

**Stay Safe On The Road! ðŸï¸**# smart-helmet

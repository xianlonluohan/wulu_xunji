// Basic test for five line tracker
input.onButtonPressed(Button.A, function () {
    let tracker = emakefun.createFiveLineTracker()
    basic.showString("ID: " + tracker.deviceId())
    basic.showString("VER: " + tracker.firmwareVersion())
})

input.onButtonPressed(Button.B, function () {
    let tracker = emakefun.createFiveLineTracker()

    // Set thresholds
    for (let i = 0; i < 5; i++) {
        tracker.setHighThreshold(i, 850)
        tracker.setLowThreshold(i, 800)
    }

    // Read values
    let values = tracker.allAnalogValues()
    for (let i = 0; i < 5; i++) {
        serial.writeLine("Sensor " + i + ": " + values[i])
    }

    // Show line position
    basic.showNumber(tracker.linePosition())
})

basic.forever(function () {
    let tracker = emakefun.createFiveLineTracker()

    if (tracker.centerDetected()) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }

    basic.pause(200)
})
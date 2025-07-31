/// <reference path="main.ts" />
let tracker = emakefun.createFiveLineTracker(0x50)

basic.forever(function () {
    serial.writeLine("=== equipment information ===")
    serial.writeString("device ID: 0x")
    serial.writeNumber(tracker.getDeviceId())
    serial.writeString(", firmware version: v")
    serial.writeNumber(tracker.getFirmwareVersion())
    serial.writeLine("")

    for (let i = 0; i < 5; i++) {
        tracker.setHighThreshold(i, 1000)
        tracker.setLowThreshold(i, 250)
    }

    while (true) {
        serial.writeLine("=== sensor data ===")

        serial.writeString("digital values:")
        for (let i = 0; i < 5; i++) {
            serial.writeNumber(tracker.digitalValue(i))
            if (i < 4) {
                serial.writeString(", ")
            }
        }

        serial.writeString(", analog values:")
        for (let i = 0; i < 5; i++) {
            serial.writeNumber(tracker.analogValue(i))
            if (i < 4) {
                serial.writeString(", ")
            }
        }
        serial.writeLine("")
        basic.pause(200)
    }
})
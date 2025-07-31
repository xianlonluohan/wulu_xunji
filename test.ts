/// <reference path="main.ts" />
let tracker = emakefun.createFiveLineTracker(0x50)

basic.forever(function () {
    serial.writeLine("=== 设备信息 ===")
    serial.writeString("设备ID: 0x")
    serial.writeNumber(tracker.getDeviceId())
    serial.writeString(" | 固件版本: v")
    serial.writeNumber(tracker.getFirmwareVersion())
    serial.writeLine("")

    for (let i = 0; i < 5; i++) {
        tracker.setHighThreshold(i, 1000)
        tracker.setLowThreshold(i, 250)
    }

    while (true) {
        serial.writeLine("=== 传感器数据 ===")

        serial.writeString("数字值: [")
        for (let i = 0; i < 5; i++) {
            serial.writeNumber(tracker.digitalValue(i))
            if (i < 4) {
                serial.writeString(", ")
            }
        }

        serial.writeString("] | 模拟值: [")
        for (let i = 0; i < 5; i++) {
            serial.writeNumber(tracker.analogValue(i))
            if (i < 4) {
                serial.writeString(", ")
            }
        }
        serial.writeLine("]")

        basic.pause(500)
    }
})
let tracker = emakefun.createFiveLineTrackerV3(0x50)

serial.writeString("device ID: ");
serial.writeNumber(tracker.getDeviceId());
serial.writeString(",firmware version: v");
serial.writeNumber(tracker.getFirmwareVersion());
serial.writeLine("");

tracker.setHighThreshold(0, 1000)
tracker.setHighThreshold(1, 1000)
tracker.setHighThreshold(2, 1000)
tracker.setHighThreshold(3, 1000)
tracker.setHighThreshold(4, 1000)

tracker.setLowThreshold(0, 200)
tracker.setLowThreshold(1, 200)
tracker.setLowThreshold(2, 200)
tracker.setLowThreshold(3, 200)
tracker.setLowThreshold(4, 200)


basic.forever(function () {


})
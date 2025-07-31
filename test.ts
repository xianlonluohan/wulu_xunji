let five_line_tracker_v3 = emakefun.createFiveLineTrackerV3(80)
for (let index = 0; index <= 4; index++) {
    five_line_tracker_v3.setHighThreshold(index, 1000)
    five_line_tracker_v3.setLowThreshold(index, 200)
}
basic.forever(function () {
    basic.showString("" + (five_line_tracker_v3.getDeviceId()))
    basic.showString("" + (five_line_tracker_v3.getFirmwareVersion()))
    for (let index = 0; index <= 4; index++) {
        basic.showString("" + (five_line_tracker_v3.analogValue(index)))
    }
    for (let index = 0; index <= 4; index++) {
        basic.showString("" + (five_line_tracker_v3.digitalValue(index)))
    }
    basic.pause(200)
})

//%block="Emakefun"
namespace emakefun {
    // I2C address of the Five Line Tracker module
    const kDefaultI2cAddress = 0x50;

    /**
     * Create a new FiveLineTrackerV3 instance
     * @param i2c_address I2C address of the module, default 0x50
     * @return The new FiveLineTrackerV3 object
    */
    //% block="create five line tracker V3 with I2C address $i2c_address"
    //% subcategory="FiveLineTrackerV3"
    //% blockSetVariable=five_line_tracker_v3
    //% i2c_address.defl=0x50
    //% weight=100
    export function createFiveLineTrackerV3(i2c_address: number = kDefaultI2cAddress): FiveLineTrackerV3 {
        return new FiveLineTrackerV3(i2c_address);
    }

    /**
     * FiveLineTrackerV3 class
     */
    export class FiveLineTrackerV3 {
        private static readonly kMemoryAddressDeviceId = 0x00;
        private static readonly kMemoryAddressVersion = 0x01;
        private static readonly kMemoryAddressAnalogValues = 0x10;
        private static readonly kMemoryAddressDigitalValues = 0x1A;
        private static readonly kMemoryAddressHighThresholds = 0x1C;
        private static readonly kMemoryAddressLowThresholds = 0x26;

        private readonly i2c_address: number = undefined

        /**
        * Constructor
        * @param i2c_address I2C address of the module, default 0x50
        */
        constructor(i2c_address: number = 0x50) {
            this.i2c_address = i2c_address;
        }

        /**
         * Get the device ID
         */
        //% block="$this get the device ID"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker_v3
        //% weight=95
        getDeviceId(): number {
            pins.i2cWriteNumber(this.i2c_address, FiveLineTrackerV3.kMemoryAddressDeviceId, NumberFormat.UInt8LE);
            return pins.i2cReadNumber(this.i2c_address, NumberFormat.UInt8LE, false);
        }

        /**
         * Get the firmware version
         */
        //% block="$this get the firmware version"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker_v3
        //% weight=94
        getFirmwareVersion(): number {
            pins.i2cWriteNumber(this.i2c_address, FiveLineTrackerV3.kMemoryAddressVersion, NumberFormat.UInt8LE);
            return pins.i2cReadNumber(this.i2c_address, NumberFormat.UInt8LE, false);
        }

        /**
        * Set the high threshold for sensors
        * @param index The sensor index (0-4)
        * @param threshold The threshold value (0-1023)
        */
        //% block="$this set high threshold for sensor $index to $threshold"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker_v3
        //% index.min=0
        //% index.max=4
        //% threshold.min=0
        //% threshold.max=1023
        //% weight=90
        setHighThreshold(index: number, threshold: number): void {
            pins.i2cWriteBuffer(this.i2c_address, Buffer.pack("<BH", [FiveLineTrackerV3.kMemoryAddressHighThresholds + index * 2, threshold]));
        }


        /**
         * Set the low threshold for sensors
         * @param index The sensor index (0-4)
         * @param threshold The threshold value (0-1023)
         */
        //% block="$this set low threshold for sensor $index to $threshold"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker_v3
        //% index.min=0
        //% index.max=4
        //% threshold.min=0
        //% threshold.max=1023
        //% weight=89
        setLowThreshold(index: number, threshold: number): void {
            pins.i2cWriteBuffer(this.i2c_address, Buffer.pack("<BH", [FiveLineTrackerV3.kMemoryAddressLowThresholds + index * 2, threshold]));

        }

        /**
         * Read analog value of sensors
         * @param index The sensor index (0-4)
         */
        //% block="$this get the analog value for channel $index"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker_v3
        //% index.min=0
        //% index.max=4
        //% weight=85
        analogValue(index: number): number {
            pins.i2cWriteNumber(this.i2c_address, FiveLineTrackerV3.kMemoryAddressAnalogValues + (index * 2), NumberFormat.UInt8LE);
            return pins.i2cReadNumber(this.i2c_address, NumberFormat.UInt16LE, false);
        }

        /**
         * Read digital value of sensors
         * @param index The sensor index (0-4)
         */
        //% block="$this get the digital value for channel $index"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker_v3
        //% index.min=0
        //% index.max=4
        //% weight=80
        digitalValue(index: number): number {
            pins.i2cWriteNumber(this.i2c_address, FiveLineTrackerV3.kMemoryAddressDigitalValues, NumberFormat.UInt8LE);
            return (pins.i2cReadNumber(this.i2c_address, NumberFormat.UInt8LE, false) >> index) & 0x01;
        }
    }
}

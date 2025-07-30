//%block="Emakefun"
namespace emakefun {
    // I2C address of the Five Line Tracker module
    const kDefaultI2cAddress = 0x50;

    /**
     * Create a new FiveLineTracker instance
     * @param i2c_address I2C address of the module, default 0x50
     * @return The new FiveLineTracker object
    */
    //% block="create five line tracker with I2C address $i2c_address"
    //% subcategory="FiveLineTrackerV3"
    //% blockSetVariable=five_line_tracker
    //% i2c_address.defl=0x50
    //% weight=100
    export function createFiveLineTracker(i2c_address: number = kDefaultI2cAddress): FiveLineTracker {
        return new FiveLineTracker(i2c_address);
    }

    /**
     * FiveLineTracker class
     */
    export class FiveLineTracker {
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

        i2cRead(register: number, length: number): Buffer {
            pins.i2cWriteNumber(this.i2c_address, register, NumberFormat.UInt8LE);
            return pins.i2cReadBuffer(this.i2c_address, length);
        }


        /**
         * Get the device ID
         */
        //% block="$this get the device ID"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker
        //% weight=95
        getDeviceId(): number {
            return this.i2cRead(FiveLineTracker.kMemoryAddressDeviceId, 1).getUint8(0);
        }

        /**
         * Get the firmware version
         */
        //% block="$this get the firmware version"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker
        //% weight=94
        getFirmwareVersion(): number {
            return this.i2cRead(FiveLineTracker.kMemoryAddressVersion, 1).getUint8(0);
        }

        /**
        * Set the high threshold for sensors
        * @param index The sensor index (0-4)
        * @param threshold The threshold value (0-1023)
        */
        //% block="$this set high threshold for sensor $index to $threshold"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker
        //% index.min=0
        //% index.max=4
        //% threshold.min=0
        //% threshold.max=1023
        //% weight=90
        setHighThreshold(index: number, threshold: number): void {
            // pins.i2cWriteBuffer(this.i2c_address, pins.pack("<BH", [FiveLineTracker.kMemoryAddressHighThresholds + (index * 2), threshold]));
            const register = FiveLineTracker.kMemoryAddressHighThresholds + (index * 2);
            const buffer = pins.pack("<BH", [register, threshold]);
            pins.i2cWriteBuffer(this.i2c_address, buffer);

        }


        /**
         * Set the low threshold for sensors
         * @param index The sensor index (0-4)
         * @param threshold The threshold value (0-1023)
         */
        //% block="$this set low threshold for sensor $index to $threshold"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker
        //% index.min=0
        //% index.max=4
        //% threshold.min=0
        //% threshold.max=1023
        //% weight=89
        setLowThreshold(index: number, threshold: number): void {
            // pins.i2cWriteBuffer(this.i2c_address, pins.pack("<BH", [FiveLineTracker.kMemoryAddressLowThresholds + (index * 2), threshold]));
            const register = FiveLineTracker.kMemoryAddressLowThresholds + (index * 2);
            const buffer = pins.pack("<BH", [register, threshold]);
            pins.i2cWriteBuffer(this.i2c_address, buffer);
        }

        /**
         * Read analog value of sensors
         * @param index The sensor index (0-4)
         */
        //% block="$this get the analog value for channel $index"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker
        //% index.min=0
        //% index.max=4
        //% weight=85
        analogValue(index: number): number {
            const buffer = this.i2cRead(FiveLineTracker.kMemoryAddressAnalogValues + (index * 2), 2);
            return buffer.getNumber(NumberFormat.UInt16LE, 0);
        }

        /**
         * Read digital value of sensors
         * @param index The sensor index (0-4)
         */
        //% block="$this get the digital value for channel $index"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker
        //% index.min=0
        //% index.max=4
        //% weight=80
        digitalValue(index: number): number {
            const byte = this.i2cRead(FiveLineTracker.kMemoryAddressDigitalValues, 1).getUint8(0);
            return (byte >> index) & 0x01;
        }
    }
}

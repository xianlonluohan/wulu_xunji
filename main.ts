//%block="emakefun"
namespace emakefun {
    // I2C address of the Five Line Tracker module
    const kDefaultI2cAddress = 0x50;

    // Memory addresses
    const kMemoryAddressDeviceId = 0x00;
    const kMemoryAddressVersion = 0x01;
    const kMemoryAddressAnalogValues = 0x10;
    const kMemoryAddressDigitalValues = 0x1A;
    const kMemoryAddressHighThresholds = 0x1C;
    const kMemoryAddressLowThresholds = 0x26;

    // Number of sensor lines
    const kLineNumber = 5;

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
    export function CreateFiveLineTracker(i2c_address: number = kDefaultI2cAddress): FiveLineTracker {
        return new FiveLineTracker(i2c_address);
    }

    /**
     * FiveLineTracker class
     */
    export class FiveLineTracker {

        private readonly i2c_address: number = undefined

        /**
     * Constructor
     * @param i2c_address I2C address of the module, default 0x50
     */
        constructor(i2c_address: number = 0x50) {
            this.i2c_address = i2c_address;
        }

        I2cRead(register: number, length: number): Buffer {
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
        GetDeviceId(): number {
            return this.I2cRead(kMemoryAddressDeviceId, 1).getUint8(0);
        }

        /**
         * Get the firmware version
         */
        //% block="$this get the firmware version"
        //% subcategory="FiveLineTrackerV3"
        //% this.defl=five_line_tracker
        //% weight=94
        GetFirmwareVersion(): number {
            return this.I2cRead(kMemoryAddressVersion, 1).getUint8(0);
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
        SetHighThreshold(index: number, threshold: number): void {
            const buffer = pins.createBuffer(3);
            buffer.setUint8(0, kMemoryAddressHighThresholds + (index * 2)); // 寄存器地址
            buffer.setUint8(1, threshold & 0xFF);  // 低字节
            buffer.setUint8(2, threshold >> 8);    // 高字节
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
        SetLowThreshold(index: number, threshold: number): void {
            const buffer = pins.createBuffer(3);
            buffer.setUint8(0, kMemoryAddressLowThresholds + (index * 2)); // 寄存器地址
            buffer.setUint8(1, threshold & 0xFF);  // 低字节
            buffer.setUint8(2, threshold >> 8);    // 高字节
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
        AnalogValue(index: number): number {
            const buffer = this.I2cRead(kMemoryAddressAnalogValues + (index * 2), 2);
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
        DigitalValue(index: number): number {
            const byte = this.I2cRead(kMemoryAddressDigitalValues, 1).getUint8(0);
            return (byte >> index) & 0x01;
        }
    }
}

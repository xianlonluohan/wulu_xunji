//%block="Emakefun"
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
    //% subcategory="FiveLineTracker"
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

        I2cWrite(register: number, data: number[]): void {
            let buffer = pins.createBuffer(data.length + 1);
            buffer.setUint8(0, register);
            for (let i = 0; i < data.length; i++) {
                buffer.setUint8(i + 1, data[i]);
            }
            pins.i2cWriteBuffer(this.i2c_address, buffer);
        }

        /**
         * Get the device ID
         */
        //% block="$this get the device ID"
        //% subcategory="FiveLineTracker"
        //% this.defl=five_line_tracker
        //% weight=95
        GetDeviceId(): number {
            return this.I2cRead(kMemoryAddressDeviceId, 1).getUint8(0);
        }

        /**
         * Get the firmware version
         */
        //% block="$this get the firmware version"
        //% subcategory="FiveLineTracker"
        //% this.defl=five_line_tracker
        //% weight=94
        GetFirmwareVersion(): number {
            return this.I2cRead(kMemoryAddressVersion, 1).getUint8(0);
        }

        /**
        * Set the high threshold for a specific channel
        * @param channel The sensor channel (0-4)
        * @param threshold The threshold value (0-1023)
        */
        //% block="$this set high threshold for channel $channel to $threshold"
        //% subcategory="FiveLineTracker"
        //% this.defl=five_line_tracker
        //% channel.min=0
        //% channel.max=4
        //% threshold.min=0
        //% threshold.max=1023
        //% weight=90
        SetHighThreshold(channel: number, threshold: number): void {
            // Convert threshold to little-endian bytes
            const lowByte = threshold & 0xFF;
            const highByte = (threshold >> 8) & 0xFF;
            this.I2cWrite(kMemoryAddressHighThresholds + (channel * 2), [lowByte, highByte]);
        }


        /**
         * Set the low threshold for a specific channel
         * @param channel The sensor channel (0-4)
         * @param threshold The threshold value (0-1023)
         */
        //% block="$this set low threshold for channel $channel to $threshold"
        //% subcategory="FiveLineTracker"
        //% this.defl=five_line_tracker
        //% channel.min=0
        //% channel.max=4
        //% threshold.min=0
        //% threshold.max=1023
        //% weight=89
        SetLowThreshold(channel: number, threshold: number): void {
            // Convert threshold to little-endian bytes
            const lowByte = threshold & 0xFF;
            const highByte = (threshold >> 8) & 0xFF;
            this.I2cWrite(kMemoryAddressLowThresholds + (channel * 2), [lowByte, highByte]);
        }

        /**
         * Get the analog value for a specific channel
         * @param channel The sensor channel (0-4)
         */
        //% block="$this get the analog value for channel $channel"
        //% subcategory="FiveLineTracker"
        //% this.defl=five_line_tracker
        //% channel.min=0
        //% channel.max=4
        //% weight=85
        AnalogValue(channel: number): number {
            const buffer = this.I2cRead(kMemoryAddressAnalogValues + (channel * 2), 2);
            // Combine bytes (little-endian)
            return (buffer.getUint8(1) << 8) | buffer.getUint8(0);
        }

        /**
        * Get all analog values as an array
        */
        //% block="$this get all analog values"
        //% subcategory="FiveLineTracker"
        //% this.defl=five_line_tracker
        //% weight=84
        AllAnalogValues(): number[] {
            const buffer = this.I2cRead(kMemoryAddressAnalogValues, kLineNumber * 2);
            const values: number[] = [];

            for (let i = 0; i < kLineNumber; i++) {
                // Combine bytes (little-endian)
                const value = (buffer.getUint8(i * 2 + 1) << 8) | buffer.getUint8(i * 2);
                values.push(value);
            }

            return values;
        }

        /**
         * Get the digital value for a specific channel
         * @param channel The sensor channel (0-4)
         */
        //% block="$this get the digital value for channel $channel"
        //% subcategory="FiveLineTracker"
        //% this.defl=five_line_tracker
        //% channel.min=0
        //% channel.max=4
        //% weight=80
        DigitalValue(channel: number): number {
            const byte = this.I2cRead(kMemoryAddressDigitalValues, 1).getUint8(0);
            return (byte >> channel) & 0x01;
        }

        /**
         * Get all digital values as a byte
         * 
         */
        //% block="$this get all digital values"
        //% subcategory="FiveLineTracker"
        //% this.defl=five_line_tracker
        //% weight=79
        AllDigitalValues(): number {
            return this.I2cRead(kMemoryAddressDigitalValues, 1).getUint8(0);
        }
    }
}

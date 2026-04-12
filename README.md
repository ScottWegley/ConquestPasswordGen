# Conquest Password Gen

This is a website allowing the creation and decoding of in game passwords for [Pokémon Conquest](https://en.wikipedia.org/wiki/Pok%C3%A9mon_Conquest).  All credit for the functionality of this project goes to [Prof. 9](https://gbatemp.net/members/prof-9.128772/) on the GBATemp forum who created a Windows application for this purpose in 2012 after cracking the game's password algorithm.  I have simply recreated [his work](https://gbatemp.net/threads/pokemon-conquest-password-generator.329260/) as a web application.

Below is my understanding of the password system, again entirely based on the work of Prof. 9 and not the source code of the game.

Every password contains 6 bytes worth of data, detailed below.
```
Byte 0: [7 6][5 4 3 2 1 0]
        │ │ └─────┬─────┘
        │ │       └─ Category (0=Pokémon, 1=Event)
        └─┴───────── Secondary Checksum bits 0-1

Byte 1: [7 6][5 4 3 2 1 0]
        │ │ └─────┬─────┘
        │ │       └─ Flag (Event: 0-4, Pokémon: 0-63)
        └─┴───────── Secondary Checksum bits 2-3

Byte 2: [7 6][5 4 3 2 1 0]
        │ │ └─────┬─────┘
        │ │       └─ Scramble Pattern (0-31) (Detailed later)
        └─┴───────── Secondary Checksum bits 4-5

Byte 3: [7 6][5 4 3 2 1 0]
        │ │ └─────┬─────┘
        │ │       └─ Scramble Pattern + 1
        └─┴───────── Secondary Checksum bits 6-7

Byte 4: [7 6][5 4 3 2 1 0]
        │ │ └─────┬─────┘
        │ │       └─ Scramble Pattern + 2
        └─┴───────── Secondary Checksum bits 8-9

Byte 5: [7 6 5 4 3 2 1 0]
        └─────┬───────┘
              └─ Pokémon ID (0-199) or unused for Events
```
*The lookup table for Pokémon is available [here](https://github.com/ScottWegley/ConquestPasswordGen/blob/main/src/lib/data.ts)*

For bytes 0-4, that data is within the lower 6 bits, with the upper two reserved for storing the bits of the secondary checksum (calculated and covered later).

## Generating Passwords

### Raw Bytes
When a password is generated, you need the Category, Flag, and Pokémon as known values.  The scramble pattern (and subsequently Scramble Pattern + 1/2) is a random number from 0-31 chosen at the time of password generated.

Here is a sample set of bytes (without the secondary checksum) representing a Pokémon password (0x00) using Flag 0 (0x00), with Scramble Pattern 21(0x15), and the Pokémon Eevee (0x00).
```
RawBytes = [0x00, 0x00, 0x15, 0x16, 0x17, 0x00]
           [Cat, Flag, Pat , P+1 , P+2 , Pkmn]
```
### Secondary Checksum
To obtain the secondary checksum, we sum Byte 5 (representing the pokemon) with the lower 6 bits of Bytes 0-4.  We only take the lower 6 whenever we calculate the checksum to ensure any existing checksum stored in the remaining 2 bits does not influence the calculation.  We then limit the checksum to 10 bits, as we will store it in the 2 upper bits of RawBytes 0-4. (2 bits across 5 bytes, 10 total bits of storage).

Continuing our previous example:
```
                 Pkmn + Cat  + Flag + Pat  + P+1  + P+2
ValidChecksum2 = 0x00 + 0x00 + 0x00 + 0x15 + 0x16 + 0x17
               = 0x42
               & 0x3FF
               = 0x42
```

With the secondary checksum determined, we just need store it in our RawBytes now.
```
For n = 0 to 4:
  RawBytes[n] |= ((Checksum >> (n * 2)) & 3) << 6

// 0x42 is binary 00 01 00 00 10 
// Category                             Cat    Checksum Bits
RawBytes[0] |= ((0x42 >> 0) & 3) << 6 = 0x00 | 0x80          = 0x80
// Flag                                 Flag   Checksum Bits
RawBytes[1] |= ((0x42 >> 2) & 3) << 6 = 0x00 | 0x00          = 0x00
// Scramble Pattern                     Pat    Checksum Bits
RawBytes[2] |= ((0x42 >> 4) & 3) << 6 = 0x15 | 0x00          = 0x15
// Scramble Pattern + 1                 Pat+1  Checksum Bits
RawBytes[3] |= ((0x42 >> 6) & 3) << 6 = 0x16 | 0x40          = 0x56
// Scramble Pattern + 2                 Pat+2  Checksum Bits
RawBytes[4] |= ((0x42 >> 8) & 3) <<6  = 0x17 | 0x00          = 0x17

// The raw bytes with the embedded checksum:
// [0x80, 0x00, 0x15, 0x56, 0x17, 0x00]
```

### Scramble Pattern
Next we need to Shuffle the bytes according to the scramble pattern.

The generic implementation of this is 
```
// Pattern lookup (using the scramble pattern without the secondary checksum bits)
Pattern = ScramblePatterns[RawBytes[2] & 0x3F]
For n = 0 to 5:
    ShuffleBytes[(Pattern >> (4 * (5 - n))) & 0xF] = RawBytes[n] XOR n
```

Using our worked example, you get the below:
```
Pattern = ScramblePatterns[21] // 0x312540
// The shuffle indexes for n of 0-5 will be [3,1,2,5,4,0]

ShuffleBytes[3] = RawBytes[0] XOR 0 = 0x80 XOR 0 = 0x80
ShuffleBytes[1] = RawBytes[1] XOR 1 = 0x00 XOR 1 = 0x01
ShuffleBytes[2] = RawBytes[2] XOR 2 = 0x15 XOR 2 = 0x17
ShuffleBytes[5] = RawBytes[3] XOR 3 = 0x56 XOR 3 = 0x55
ShuffleBytes[4] = RawBytes[4] XOR 4 = 0x17 XOR 4 = 0x13
ShuffleBytes[0] = RawBytes[5] XOR 5 = 0x00 XOR 5 = 0x05

// NA ShuffleBytes = [0x05, 0x01, 0x17, 0x80, 0x13, 0x55]
```
The JP scramble patterns are different from NA.  Using the same RawBytes with the JP table:
```
Pattern = JPScramblePatterns[21] // 0x302514
// The shuffle indexes for n of 0-5 will be [3,0,2,5,1,4]

ShuffleBytes[3] = RawBytes[0] XOR 0 = 0x80 XOR 0 = 0x80
ShuffleBytes[0] = RawBytes[1] XOR 1 = 0x00 XOR 1 = 0x01
ShuffleBytes[2] = RawBytes[2] XOR 2 = 0x15 XOR 2 = 0x17
ShuffleBytes[5] = RawBytes[3] XOR 3 = 0x56 XOR 3 = 0x55
ShuffleBytes[1] = RawBytes[4] XOR 4 = 0x17 XOR 4 = 0x13
ShuffleBytes[4] = RawBytes[5] XOR 5 = 0x00 XOR 5 = 0x05

// JP ShuffleBytes = [0x01, 0x13, 0x17, 0x80, 0x05, 0x55]
```
Note that the same RawBytes produce different ShuffleBytes per region.  From this point forward the NA and JP examples diverge, only converging back to the same RawBytes during decoding.

### Character Encoding
With the bytes shuffled, we now have to encode the data into text characters based on the password region.  For NA passwords, that is a custom base57.  For JP passwords, it is a custom base66.  Both character sets can be viewed [here](https://github.com/ScottWegley/ConquestPasswordGen/blob/main/src/lib/data.ts).

#### NA Encoding
We have 6 bytes of data that we will split into two groups of 3.
``` 
// [0x05, 0x01, 0x17] and [0x80, 0x13, 0x55]
```
The data ranges from 0-255 (a byte), which is obviously bigger than base 57.  To account for this, we need to split each byte into 2 values: Byte modulo 57 (which gives us the remainder, range of 0-56), and Byte / 57 rounded down (which gives us the quotient, range of 0-4).  We can store the remainder as one byte, and the quotient as 3 bits.  This allows us to turn 3 bytes of base 256 data into 5 base 57 characters.  
The below table details the process that will be applies to both sets of 3 bytes.  The end result is 10 total characters.
| Password Bytes | Content                                              |
|----------------|------------------------------------------------------|
| 0              | Remainder of Byte 0                                  |
| 1              | Remainder of Byte 1                                  |
| 2              | Remainder of Byte 2                                  |
| 3              | The quotient of Bytes 0 and 1                        |
| 4              | The quotient of Byte 2, extra space to be used later |
| 5              | Remainder of Byte 3                                  |
| 6              | Remainder of Byte 4                                  |
| 7              | Remainder of Byte 5                                  |
| 8              | The quotient of Bytes 3 and 4                        |
| 9              | The quotient of Byte 5, extra space to be used later |

Using our worked example:
```
PassBytes[0] = 0x05 % 0x39 = 5
PassBytes[3] |= 0x05 / 0x39 = 0

PassBytes[1] = 0x01 % 0x39 = 1
PassBytes[3] |= (0x01 / 0x39) << 3 = 0

PassBytes[2] = 0x17 % 0x39 = 23
PassBytes[4] |= 0x17 / 0x39 = 0

PassBytes[5] = 0x80 % 0x39 = 14
PassBytes[8] |= 0x80 / 0x39 = 2

PassBytes[6] = 0x13 % 0x39 = 19
PassBytes[8] |= (0x13 / 0x39) << 3 = 2 | 0 = 2

PassBytes[7] = 0x55 % 0x39 = 28
PassBytes[9] |= 0x55 / 0x39 = 1

// Current Password Bytes [5, 1, 23, 0, 0, 14, 19, 28, 2, 1]
```
*Primary Checksum*

For NA passwords only, after we have calculated the initial value of the password byes we need to add in a primary checksum in the extra unused space of bytes 4 and 9.  This value is calculated from the Shuffled Byes.  For each 3-byte group, we use the half-bytes of the first two shuffled bytes and store 3 resulting bits into PassBytes:
```
// ShuffleBytes = [0x05, 0x01, 0x17, 0x80, 0x13, 0x55]
// PassBytes = [5, 1, 23, 0, 0, 14, 19, 28, 2, 1]

// Group 1: [0x05, 0x01, 0x17]
// Intermediary Value (ShuffleBytes[0] & 0xF) | ((ShuffleBytes[1] & 0xF) << 4)
TempVal = (0x05 & 0xF) | ((0x01 & 0xF) << 4) // = 0x15
Checksum = Math.floor(0x15 / 0x39) // = 0x0

// Store the checksum for the first group in PassBytes[4].  PassBytes[4] has 3 bits in it already from the shuffled bits encoding, so we need to shift the checksum over to preserve those bits.
PassBytes[4] |= (Checksum & 0x7) << 3 // = 0

// Group 2: [0x80, 0x13, 0x55]
// Intermediary Value (ShuffleBytes[3] & 0xF) | ((ShuffleBytes[4] & 0xF) << 4)
TempVal = (0x80 & 0xF) | ((0x13 & 0xF) << 4) // = 0x30
Checksum = Math.floor(0x30 / 0x39) // = 0x0

// Store the checksum for the second group in PassBytes[9].  PassBytes[9] has 3 bits in it already from the shuffled bits encoding, so we need to shift the checksum over to preserve those bits.
PassBytes[9] |= (Checksum & 0x7) << 3 // = 1
```

#### JP Encoding
The encoding process for Kanji is similar to the Latin alphabet encoding process.  The differences to highlight are the output being base 66 in this instance, the length of the output being 8 characters instead of 10, and the absence of the primary checksum.  We will again split our 6 bytes into two groups of 3.
``` 
// JP ShuffleBytes = [0x01, 0x13, 0x17, 0x80, 0x05, 0x55]
// [0x01, 0x13, 0x17] and [0x80, 0x05, 0x55]
```
Our byte representation is the same as the NA scheme, with each bytes being represented by the quotient and remainder of the byte divided by 66.  The remainders (range 0-65) are one byte and will be stored as is.  Each quotient (range 0-3) is two bits, so we will combine them all to store them in one additional byte.  This means each group of 3 input bytes will turn into 4 output bytes.  See the below table laying out each byte and the data stored.
| Password Bytes | Content                           |
|----------------|-----------------------------------|
| 0              | Remainder of Byte 0               |
| 1              | Remainder of Byte 1               |
| 2              | Remainder of Byte 2               |
| 3              | The quotient of Bytes 0, 1, and 2 |
| 4              | Remainder of Byte 3               |
| 5              | Remainder of Byte 4               |
| 6              | Remainder of Byte 5               |
| 7              | The quotient of Bytes 3, 4, and 5 |
Using our worked example:
```
PassBytes[0] = 0x01 % 0x42 = 1
PassBytes[3] = (0x01 / 0x42) = 0

PassBytes[1] = 0x13 % 0x42 = 19
PassBytes[3] |= (0x13 / 0x42) << 2 = 0

PassBytes[2] = 0x17 % 0x42 = 23
PassBytes[3] |= (0x17 / 0x42) << 4 = 0

PassBytes[4] = 0x80 % 0x42 = 62
PassBytes[7] = 0x80 / 0x42 = 1

PassBytes[5] = 0x05 % 0x42 = 5
PassBytes[7] |= (0x05 / 0x42) << 2 // PassBytes[7] |= 0  == 1

PassBytes[6] = 0x55 % 0x42 = 19 
PassBytes[7] |= (0x55 / 0x42) << 4 // PassBytes[7] |= 16 == 17

// Current Password Bytes: [1, 19, 23, 0, 62, 5, 19, 17]
```

### Convert to Characters
At this stage we have an array of indexes, either 10 or 8 long.  The last remaining step is using these indexes to create the actual passwords.
```
password = ""
// NA Example
PassBytes.forEach((p) => {
    password += NACharacters[p]
})
// JP Example
PassBytes.forEach((p) => {
    password += JPCharacters[p]
})
```
The final passwords in this example are:
| *NA Password* | *JP Password*  |
|---------------|----------------|
| `2JKRRqGN8J`  |`イルビカ８０ルヘ` |

## Decoding Passwords

The first step in decoding Conquest passwords is converting the characters back to index values.
```
PassBytes = []
password.split('').forEach((c) => {
    passBytes.push(CharSet.indexOf(c)) // Char Set will be NA Characters if the password is length 10, Japanese if the password is length 8
})
```
|   Password   | Password Bytes             |
|--------------|----------------------------|
| 2JKRRqGN8J   | [5,1,23,0,0,14,19,28,2,1]  |
|イルビカ８０ルヘ| [1,19,23,0,62,5,19,17]     |

### Return to Scrambled Bytes


#### Base 57 (NA)
In the base 57 encoding scheme, we divided up the raw data by 57 and took quotients and remainders to make up the password indexes.  We now need to reverse this process and retrieve the quotient and remainders.  The table from the encoding step is a helpful reference here.
| Password Bytes | Content                                              |
|----------------|------------------------------------------------------|
| 0              | Remainder of Byte 0                                  |
| 1              | Remainder of Byte 1                                  |
| 2              | Remainder of Byte 2                                  |
| 3              | The quotient of Bytes 0 and 1                        |
| 4              | The quotient of Byte 2, part of the primary checksum |
| 5              | Remainder of Byte 3                                  |
| 6              | Remainder of Byte 4                                  |
| 7              | Remainder of Byte 5                                  |
| 8              | The quotient of Bytes 3 and 4                        |
| 9              | The quotient of Byte 5, part of the primary checksum |

```
// PassBytes = [5,1,23,0,0,14,19,28,2,1]
ShuffleBytes[0] = (0 & 0x7) * 0x39 + 5 = 0x05 // (PassBytes[3] & 0x7) * 57 + PassBytes[0]
ShuffleBytes[1] = (0 >> 3) * 0x39 + 1 = 0x01 // (PassBytes[3] >> 3) * 57 + PassBytes[1]
ShuffleBytes[2] = (0 & 0x7) * 0x39 + 23 = 0x17 // (PassBytes[4] & 0x7) * 57 + PassBytes[2]

ShuffleBytes[3] = (2 & 0x7) * 0x39 + 14 = 0x80 // (PassBytes[8] & 0x7) * 57 + PassBytes[5]
ShuffleBytes[4] = (2 >> 3) * 0x39 + 19 = 0x13 // (PassBytes[8] >> 3) * 57 + PassBytes[6]
ShuffleBytes[5] = (1 & 0x7) * 0x39 + 28 = 0x55 // (PassBytes[9] & 0x7) * 57 + PassBytes[7]

// ShuffleBytes: [0x05, 0x01, 0x17, 0x80, 0x13, 0x55]
```

As an additional NA only step, we will also validate the primary checksum here.

Using our worked example:
```
// ShuffleBytes = [0x05, 0x01, 0x17, 0x80, 0x13, 0x55]
// PassBytes = [5, 1, 23, 0, 0, 14, 19, 28, 2, 1]

// Group 1
Mesh = (0x05 & 0xF) | ((0x01 & 0xF) << 4) = 0x15
ValidChecksum = Math.floor(0x15 / 0x39) = 0
PassChecksum = PassBytes[4] >> 3 = 0 >> 3 = 0
// 0 == 0 | Pass

// Group 2
Mesh = (0x80 & 0xF) | ((0x13 & 0xF) << 4) = 0x30
ValidChecksum = Math.floor(0x30 / 0x39) = 0
PassChecksum = PassBytes[9] >> 3 = 1 >> 3 = 0
// 0 == 0 | Pass
```

#### Base 66 (JP)
In the base 66 encoding scheme, we divided up the raw data by 66 and took quotients and remainders to make up the password indexes.  We now need to reverse this process and retrieve the quotient and remainders.  The table from the encoding step is a helpful reference here.
| Password Bytes | Content                           |
|----------------|-----------------------------------|
| 0              | Remainder of Byte 0               |
| 1              | Remainder of Byte 1               |
| 2              | Remainder of Byte 2               |
| 3              | The quotient of Bytes 0, 1, and 2 |
| 4              | Remainder of Byte 3               |
| 5              | Remainder of Byte 4               |
| 6              | Remainder of Byte 5               |
| 7              | The quotient of Bytes 3, 4, and 5 |

```
// PassBytes = [1,19,23,0,62,5,19,17]
ShuffleBytes[0] = (0 & 0x3) * 0x42 + 1 = 0x01  // (PassBytes[3] & 0x3) * 66 + PassBytes[0]
ShuffleBytes[1] = ((0 >> 2) & 0x3) * 0x42 + 19 = 0x13  // ((PassBytes[3] >> 2) & 0x3) * 66 + PassBytes[1]
ShuffleBytes[2] = ((0 >> 4) & 0x3) * 0x42 + 23 = 0x17  // ((PassBytes[3] >> 4) & 0x3) * 66 + PassBytes[2]

ShuffleBytes[3] = (17 & 0x3) * 0x42 + 62 = 0x80  // (PassBytes[7] & 0x3) * 66 + PassBytes[4]
ShuffleBytes[4] = ((17 >> 2) & 0x3) * 0x42 + 5 = 0x05  // ((PassBytes[7] >> 2) & 0x3) * 66 + PassBytes[5]
ShuffleBytes[5] = ((17 >> 4) & 0x3) * 0x42 + 19 = 0x55  // ((PassBytes[7] >> 4) & 0x3) * 66 + PassBytes[6]

// ShuffleBytes: [0x01, 0x13, 0x17, 0x80, 0x05, 0x55]
```

### Unshuffle the Bytes
Now that we have extracted the Shuffled Bytes, we need to unshuffle them according to whichever scramble pattern was used.  Every scramble pattern for both NA an JP encoding always results in the index of the pattern being stored in the third byte.  The raw bytes is always XORed with its index to encode it.  This means that access the Scramble Pattern index in the already shuffled bytes simply requires you to extract it from `ShuffleBytes[2]` (ignoring the checksum parts of the byte) and XOR it with 2 again.

#### NA Example
```
// NA ShuffleBytes = [0x05, 0x01, 0x17, 0x80, 0x13, 0x55]

// Recover the scramble pattern index
PatternIndex = (ShuffleBytes[2] & 0x3F) XOR 2
             = (0x17 & 0x3F) XOR 2
             = 0x17 XOR 2
             = 0x15 = 21

// Look up the pattern
Pattern = NAScramblePatterns[21] = 0x312540
// The pattern encodes source positions: [3,1,2,5,4,0]

// For each n, read from the position the pattern says, then XOR with n
RawBytes[0] = ShuffleBytes[3] XOR 0 = 0x80 XOR 0 = 0x80
RawBytes[1] = ShuffleBytes[1] XOR 1 = 0x01 XOR 1 = 0x00
RawBytes[2] = ShuffleBytes[2] XOR 2 = 0x17 XOR 2 = 0x15
RawBytes[3] = ShuffleBytes[5] XOR 3 = 0x55 XOR 3 = 0x56
RawBytes[4] = ShuffleBytes[4] XOR 4 = 0x13 XOR 4 = 0x17
RawBytes[5] = ShuffleBytes[0] XOR 5 = 0x05 XOR 5 = 0x00

// RawBytes: [0x80, 0x00, 0x15, 0x56, 0x17, 0x00]
```
#### JP Example
```
// JP ShuffleBytes = [0x01, 0x13, 0x17, 0x80, 0x05, 0x55]

// Recover the scramble pattern index
PatternIndex = (ShuffleBytes[2] & 0x3F) XOR 2
             = (0x17 & 0x3F) XOR 2
             = 0x17 XOR 2
             = 0x15 = 21

// Look up the pattern (JP table this time)
Pattern = JPScramblePatterns[21] = 0x302514
// The pattern encodes source positions: [3,0,2,5,1,4]

// For each n, read from the position the pattern says, then XOR with n
RawBytes[0] = ShuffleBytes[3] XOR 0 = 0x80 XOR 0 = 0x80
RawBytes[1] = ShuffleBytes[0] XOR 1 = 0x01 XOR 1 = 0x00
RawBytes[2] = ShuffleBytes[2] XOR 2 = 0x17 XOR 2 = 0x15
RawBytes[3] = ShuffleBytes[5] XOR 3 = 0x55 XOR 3 = 0x56
RawBytes[4] = ShuffleBytes[1] XOR 4 = 0x13 XOR 4 = 0x17
RawBytes[5] = ShuffleBytes[4] XOR 5 = 0x05 XOR 5 = 0x00

// RawBytes: [0x80, 0x00, 0x15, 0x56, 0x17, 0x00]
// Both regions recover the same RawBytes — this is the convergence point.
```

### Data Extraction & Secondary Checksum
Now that we have our raw bytes, we just need to extract the data and validate that the secondary checksum is intact.  We will mask off the upper 2 checksum bits from each byte to extract the 6-bit data fields:
```
Mode           = RawBytes[0] & 0x3F    // 0 = Pokémon, 1 = Event
Flag           = RawBytes[1] & 0x3F    // Event: 0-4, Pokémon: 0-63
ScramblePattern = RawBytes[2] & 0x3F   // 0-31
PokémonID      = RawBytes[5]           // Full 8 bits (0-199)
```
Using our worked example:
```
// RawBytes: [0x80, 0x00, 0x15, 0x56, 0x17, 0x00]

Mode           = 0x80 & 0x3F = 0x00 (Pokémon)
Flag           = 0x00 & 0x3F = 0x00
ScramblePattern = 0x15 & 0x3F = 0x15 (21)
PokémonID      = 0x00 (Eevee)
```
To validate the secondary checksum, we extract the 10-bit checksum that was distributed across the upper 2 bits of RawBytes[0-4], then recompute it from the data and compare:
```
// RawBytes: [0x80, 0x00, 0x15, 0x56, 0x17, 0x00]

// Extract the embedded checksum from the upper 2 bits of each byte
PassChecksum = 0
PassChecksum |= (0x80 >> 6) << 0 = 2       // bits 0-1
PassChecksum |= (0x00 >> 6) << 2 = 0       // bits 2-3
PassChecksum |= (0x15 >> 6) << 4 = 0       // bits 4-5
PassChecksum |= (0x56 >> 6) << 6 = 0x40    // bits 6-7
PassChecksum |= (0x17 >> 6) << 8 = 0       // bits 8-9
// PassChecksum = 0x02 | 0x00 | 0x00 | 0x40 | 0x00 = 0x42

// Recompute the expected checksum from the data
ValidChecksum = RawBytes[5]
              + (RawBytes[0] & 0x3F)
              + (RawBytes[1] & 0x3F)
              + (RawBytes[2] & 0x3F)
              + (RawBytes[3] & 0x3F)
              + (RawBytes[4] & 0x3F)
            = 0x00 + 0x00 + 0x00 + 0x15 + 0x16 + 0x17
            = 0x42
            & 0x3FF
            = 0x42

// 0x42 == 0x42 | Pass
```

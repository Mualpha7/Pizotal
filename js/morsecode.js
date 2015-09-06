var morseCode = (function(){
    this._dotDuration = 250;
    this._dashDuration = (this._dotDuration * 3);
    this._pauseDuration = (this._dotDuration * 1);
    this._patternMap = {
        ".-": "A",
        "-...": "B",
        "-.-.": "C",
        "-..": "D",
        ".": "E",
        "..-.": "F",
        "--.": "G",
        "....": "H",
        "..": "I",
        ".---": "J",
        "-.-": "K",
        ".-..": "L",
        "--": "M",
        "-.": "N",
        "---": "O",
        ".--.": "P",
        "--.-": "Q",
        ".-.": "R",
        "...": "S",
        "-": "T",
        "..-": "U",
        "...-": "V",
        ".--": "W",
        "-..-": "X",
        "-.--": "Y",
        "--..": "Z",
        "-----": "0",
        ".----": "1",
        "..---": "2",
        "...--": "3",
        "....-": "4",
        ".....": "5",
        "-....": "6",
        "--...": "7",
        "---..": "8",
        "----.": "9"
    };
    this._sequence = "";
    this.addSequence = function( value ){
         if (
            (value !== ".") &&
            (value !== "-")
            ){
                throw( new Error( "InvalidTone" ) );
            }
            this._sequence += value;
            return( this );
    };
    this.dash = function(){
        //Adds dash to the sequence
        return( this.addSequence( "-" ) );
    };
    this.dot = function(){
        //Adds dot to the sequence
        return( this.addSequence( "." ) );
    };
    //Returns the alphanumeric character
    this.getAlphabet = function(){
        var characterSet = [];
        for (var pattern in this._patternMap){
            characterSet.push({
                sequence: pattern,
                character: this._patternMap[ pattern ]
        });
    }
    characterSet.sort(
        function( a, b ){
            return( a.character <= b.character ? -1 : 1 );
        }
    );
    return( characterSet );
    };
    this.getDashDuration = function(){
        return( this._dashDuration );
    };
    this.getDotDuration = function(){
        return( this._dotDuration );
    };
    this.getPauseDuration = function(){
        return( this._pauseDuration );
    };
    this.resetSequence = function(){
        this._sequence = "";
    };
    this.resolvePartial = function(){
        var potentialCharacters = [];
        for (var pattern in this._patternMap){
        if (pattern.indexOf( this._sequence ) === 0){
            potentialCharacters.push(
                this._patternMap[ pattern ]
            );
            }
        }
        return( potentialCharacters.sort() );
    };
    this.resolveSequence = function(){
        if (!this._patternMap.hasOwnProperty( this._sequence )){
            throw( new Error( "InvalidSequence" ) );
        }
        var character = this._patternMap[ this._sequence ];
        this._sequence = "";
        return( character );
    };
    return( this );
}).call( {} );
(function( $, container, morseCode ){
            // Get the dom elements in this module.
            var dom = {
                characters: container.find( "ul.characters" ),
                template: container.find( "script.template" )
            };
            // Get the the alphabet from the morse code model.
            var alphabet = morseCode.getAlphabet();
            // Loop over the alphabet to build the output.
            for (var i = 0 ; i < alphabet.length ; i++){
                // Get the current letter short-hand.
                var letter = alphabet[ i ];
                // Create a new instance of the template.
                var template = $( dom.template.html() );
                // Set the character.
                template.find( "span.character" ).text(
                    letter.character
                );
                // Set the sequence.
                template.find( "span.sequence" ).text(
                    letter.sequence
                );
                // Add the template to the output.
                dom.characters.append( template );
            }
        })( jQuery, $( "div.alphabet" ), morseCode );
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        // Initialize the interpreter.
        (function( $, container, morseCode ){
            // Get the dom elements in this module.
            var dom = {
                characters: container.find( "span.characters" ),
                possibleCharacters: container.find( "span.possibleCharacters" )
            };
            // Get the dot and dash durations (in milliseconds).
            var dotDuration = morseCode.getDotDuration();
            var dashDuration = morseCode.getDashDuration();
            var pauseDuration = morseCode.getPauseDuration();
            // Store the date/time for the keydown.
            var keyDownDate = null;
            // Keep a timer for post-key resolution for characters.
            var resolveTimer = null;
            // Keep a timer for adding a new space to the message.
            var spaceTimer = null;
            // For this module, we are going to bind to any key click
            // to indicate an interaction with the interpreter. There
            // will be no other key interaction.
            $( document ).keydown(
                function( event ){
                    // Prevent any default action.
                    event.preventDefault();
                    // Check to see if there is a key-down date. If
                    // so, then exit - we only want the first press
                    // event to be registered.
                    if (keyDownDate){
                        // Don't process this event.
                        return;
                    }
                    // Clear the resolution timer.
                    clearTimeout( resolveTimer );
                    // Clear the space timer.
                    clearTimeout( spaceTimer );
                    // Store the date for this key-down.
                    keyDownDate = new Date();
                }
            );
            $( document ).keyup(
                function( event ){
                    // Prevent any default action.
                    event.preventDefault();
                    // Determine the keypress duration.
                    var keyPressDuration = ((new Date())- keyDownDate);
                    // Clear the key down date so subsequent key
                    // press events can be processed.
                    keyDownDate = null;
                    // Check to see if the duration indicates a dot
                    // or a dash.
                    if (keyPressDuration <= dotDuration){
                        // Push a dot.
                        morseCode.dot();
                    } else {
                        // Push a dash.
                        morseCode.dash();
                    }
                    // Display the possible characters for the current
                    // sequence.
                    dom.possibleCharacters.text(
                        morseCode.resolvePartial().join( " , " )
                    );
                    // Now that the key has been pressed, we need to
                    // wait a bit to see if we need to resolve the
                    // current sequence (if the user doesn't interact
                    // with the interpreter, we'll resolve).
                    resolveTimer = setTimeout(
                        function(){
                            // Try to resolve the sequence.
                            try {
                                // Get the character respresented by
                                // the current sequence.
                                var character = morseCode.resolveSequence();
                                // Add it to the output.
                                dom.characters.text(
                                    dom.characters.text() + character
                                );
                            } catch (e) {
                                // Reset the sequence - something
                                // went wrong with the user's input.
                                morseCode.resetSequence();
                            }
                            // Clear the possible matches.
                            dom.possibleCharacters.empty();
                            // Set a timer to add a new space to the
                            // message.
                            spaceTimer = setTimeout(
                                function(){
                                    // Add a "space".
                                    dom.characters.text(
                                        dom.characters.text() + "__"
                                    );
                                },
                                3500
                            );
                        },
                        (pauseDuration * 3)
                    );
                }
            );
        })( jQuery, $( "div.output" ), morseCode );
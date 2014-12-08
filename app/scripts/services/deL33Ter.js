/*
Based (and revisited) on
http://www.codeproject.com/Tips/207582/L-t-Tr-nsl-t-r-Leet-Translator


// Original text
var myText = 'Leet Translator';
 
// Translated text
var leetText = Leet.Translate(myText, 30);
 
// Output is: L33t Tr4nsl4t0r
console.log(leetText);
 
// Do it again, and change degree to 100.
var leetText = Leet.Translate(myText, 100);
 
// Output is: £337 7®4|\|$£470®
console.log(leetText);
*/ 
(function(window){
    'use strict';

    var L33t = {};
    /// <summary>
    /// Translate text to Leet
    /// </summary>
    /// <param name='text'>Orginal text</param>
    /// <param name='degree'>Degree of translation (0 - 100%)</param>
    /// <returns>Leet translated text</returns>
    L33t.Translate = function(text, degree)
    {
      if(!degree) {
        degree = 45;
    }
      // Adjust degree between 0 - 100
      degree = degree >= 100 ? 100 : degree <= 0 ? 0 : degree;
      // No Leet Translator
      if (degree === 0) { return text; }
      // StringBuilder to store result.
      var sb = '';
      var i = 0;
      for (i = 0; i<text.length; i++)
      {
        var c = text.charAt(i);

        //Degree > 0 and < 17
        if (degree < 17 && degree > 0)
        {
          switch (c)
          {
            case 'e': sb += ('3'); break;
            case 'E': sb += ('3'); break;
            default: sb += (c); break;
        }
    }

        //Degree > 16 and < 33
        else if (degree < 33 && degree > 16)
        {
          switch (c)
          {
            case 'a': sb += ('4'); break;
            case 'e': sb += ('3'); break;
            case 'i': sb += ('1'); break;
            case 'o': sb += ('0'); break;
            case 'A': sb += ('4'); break;
            case 'E': sb += ('3'); break;
            case 'I': sb += ('1'); break;
            case 'O': sb += ('0'); break;
            default: sb += (c); break;
        }
    }

        //Degree > 32 and < 49
        else if (degree < 49 && degree > 32)
        {
          switch (c)
          {
            case 'a': sb += ('4'); break;
            case 'e': sb += ('3'); break;
            case 'i': sb += ('1'); break;
            case 'o': sb += ('0'); break;
            case 'A': sb += ('4'); break;
            case 'E': sb += ('3'); break;
            case 'I': sb += ('1'); break;
            case 'O': sb += ('0'); break;
            case 's': sb += ('5'); break;
            case 'S': sb += ('5'); break;
            case 't': sb += ('7'); break;
            case 'T': sb += ('7'); break;
            case 'z': sb += ('2'); break;
            case 'Z': sb += ('2'); break;
            default: sb += (c); break;
        }
    }

        //Degree > 48 and < 65
        else if (degree < 65 && degree > 48)
        {
          switch (c)
          {
            case 'a': sb += ('4'); break;
            case 'e': sb += ('3'); break;
            case 'i': sb += ('1'); break;
            case 'o': sb += ('0'); break;
            case 'A': sb += ('4'); break;
            case 'E': sb += ('3'); break;
            case 'I': sb += ('1'); break;
            case 'O': sb += ('0'); break;
            case 'k': sb += ('|{'); break;
            case 'K': sb += ('|{'); break;
            case 's': sb += ('5'); break;
            case 'S': sb += ('5'); break;
            case 'g': sb += ('9'); break;
            case 'G': sb += ('9'); break;
            case 'l': sb += ('£'); break;
            case 'L': sb += ('£'); break;
            case 'c': sb += ('('); break; // )
            case 'C': sb += ('('); break; // )
            case 't': sb += ('7'); break;
            case 'T': sb += ('7'); break;
            case 'z': sb += ('2'); break;
            case 'Z': sb += ('2'); break;
            case 'y': sb += ('¥'); break;
            case 'Y': sb += ('¥'); break;
            case 'u': sb += ('µ'); break;
            case 'U': sb += ('µ'); break;
            case 'f': sb += ('ƒ'); break;
            case 'F': sb += ('ƒ'); break;
            case 'd': sb += ('Ð'); break;
            case 'D': sb += ('Ð'); break;
            default: sb += (c); break;
        }
    }

        //Degree > 64 and < 81
        else if (degree < 81 && degree > 64)
        {
          switch (c)
          {
            case 'a': sb += ('4'); break;
            case 'e': sb += ('3'); break;
            case 'i': sb += ('1'); break;
            case 'o': sb += ('0'); break;
            case 'A': sb += ('4'); break;
            case 'E': sb += ('3'); break;
            case 'I': sb += ('1'); break;
            case 'O': sb += ('0'); break;
            case 'k': sb += ('|{'); break;
            case 'K': sb += ('|{'); break;
            case 's': sb += ('5'); break;
            case 'S': sb += ('5'); break;
            case 'g': sb += ('9'); break;
            case 'G': sb += ('9'); break;
            case 'l': sb += ('£'); break;
            case 'L': sb += ('£'); break;
            case 'c': sb += ('('); break; // )
            case 'C': sb += ('('); break; // )
            case 't': sb += ('7'); break;
            case 'T': sb += ('7'); break;
            case 'z': sb += ('2'); break;
            case 'Z': sb += ('2'); break;
            case 'y': sb += ('¥'); break;
            case 'Y': sb += ('¥'); break;
            case 'u': sb += ('µ'); break;
            case 'U': sb += ('µ'); break;
            case 'f': sb += ('ƒ'); break;
            case 'F': sb += ('ƒ'); break;
            case 'd': sb += ('Ð'); break;
            case 'D': sb += ('Ð'); break;
            case 'n': sb += ('|\\|'); break;
            case 'N': sb += ('|\\|'); break;
            case 'w': sb += ('\\/\\/'); break;
            case 'W': sb += ('\\/\\/'); break;
            case 'h': sb += ('|-|'); break;
            case 'H': sb += ('|-|'); break;
            case 'v': sb += ('\\/'); break;
            case 'V': sb += ('\\/'); break;
            case 'm': sb += ('|\\/|'); break;
            case 'M': sb += ('|\\/|'); break;
            default: sb += (c); break;
        }
    }

        //Degree < 100 and > 80
        else if (degree > 80 && degree < 100)
        {
          switch (c)
          {
            case 'a': sb += ('4'); break;
            case 'e': sb += ('3'); break;
            case 'i': sb += ('1'); break;
            case 'o': sb += ('0'); break;
            case 'A': sb += ('4'); break;
            case 'E': sb += ('3'); break;
            case 'I': sb += ('1'); break;
            case 'O': sb += ('0'); break;
            case 's': sb += ('5'); break;
            case 'S': sb += ('5'); break;
            case 'g': sb += ('9'); break;
            case 'G': sb += ('9'); break;
            case 'l': sb += ('£'); break;
            case 'L': sb += ('£'); break;
            case 'c': sb += ('('); break; // )
            case 'C': sb += ('('); break; // )
            case 't': sb += ('7'); break;
            case 'T': sb += ('7'); break;
            case 'z': sb += ('2'); break;
            case 'Z': sb += ('2'); break;
            case 'y': sb += ('¥'); break;
            case 'Y': sb += ('¥'); break;
            case 'u': sb += ('µ'); break;
            case 'U': sb += ('µ'); break;
            case 'f': sb += ('ƒ'); break;
            case 'F': sb += ('ƒ'); break;
            case 'd': sb += ('Ð'); break;
            case 'D': sb += ('Ð'); break;
            case 'n': sb += ('|\\|'); break;
            case 'N': sb += ('|\\|'); break;
            case 'w': sb += ('\\/\\/'); break;
            case 'W': sb += ('\\/\\/'); break;
            case 'h': sb += ('|-|'); break;
            case 'H': sb += ('|-|'); break;
            case 'v': sb += ('\\/'); break;
            case 'V': sb += ('\\/'); break;
            case 'k': sb += ('|{'); break;
            case 'K': sb += ('|{'); break;
            case 'r': sb += ('®'); break;
            case 'R': sb += ('®'); break;
            case 'm': sb += ('|\\/|'); break;
            case 'M': sb += ('|\\/|'); break;
            case 'b': sb += ('ß'); break;
            case 'B': sb += ('ß'); break;
            case 'q': sb += ('Q'); break;
            case 'Q': sb += ('Q¸'); break;
            case 'x': sb += (')('); break;
            case 'X': sb += (')('); break;
            default: sb += (c); break;
        }
    }

        //Degree 100
        else if (degree > 99)
        {
          switch (c)
          {
            case 'a': sb += ('4'); break;
            case 'e': sb += ('3'); break;
            case 'i': sb += ('1'); break;
            case 'o': sb += ('0'); break;
            case 'A': sb += ('4'); break;
            case 'E': sb += ('3'); break;
            case 'I': sb += ('1'); break;
            case 'O': sb += ('0'); break;
            case 's': sb += ('5'); break;
            case 'S': sb += ('5'); break;
            case 'g': sb += ('9'); break;
            case 'G': sb += ('9'); break;
            case 'l': sb += ('£'); break;
            case 'L': sb += ('£'); break;
            case 'c': sb += ('('); break; // )
            case 'C': sb += ('('); break; // )
            case 't': sb += ('7'); break;
            case 'T': sb += ('7'); break;
            case 'z': sb += ('2'); break;
            case 'Z': sb += ('2'); break;
            case 'y': sb += ('¥'); break;
            case 'Y': sb += ('¥'); break;
            case 'u': sb += ('µ'); break;
            case 'U': sb += ('µ'); break;
            case 'f': sb += ('ƒ'); break;
            case 'F': sb += ('ƒ'); break;
            case 'd': sb += ('Ð'); break;
            case 'D': sb += ('Ð'); break;
            case 'n': sb += ('|\\|'); break;
            case 'N': sb += ('|\\|'); break;
            case 'w': sb += ('\\/\\/'); break;
            case 'W': sb += ('\\/\\/'); break;
            case 'h': sb += ('|-|'); break;
            case 'H': sb += ('|-|'); break;
            case 'v': sb += ('\\/'); break;
            case 'V': sb += ('\\/'); break;
            case 'k': sb += ('|{'); break;
            case 'K': sb += ('|{'); break;
            case 'r': sb += ('®'); break;
            case 'R': sb += ('®'); break;
            case 'm': sb += ('|\\/|'); break;
            case 'M': sb += ('|\\/|'); break;
            case 'b': sb += ('ß'); break;
            case 'B': sb += ('ß'); break;
            case 'j': sb += ('_|'); break;
            case 'J': sb += ('_|'); break;
            case 'P': sb += ('|°'); break;
            case 'q': sb += ('¶'); break;
            case 'Q': sb += ('¶¸'); break;
            case 'x': sb += (')('); break;
            case 'X': sb += (')('); break;
            default: sb += (c); break;
        }
    }

}
      return sb; // Return result.
  };

  window.L33t = L33t;
})(window);
/**
 * Created by Alena on 11.01.2018.
 */
$(document).ready(function () {

    $('#coding').on('click', function () {
        var input = new Input();
        var code;

        var p = parseInt(input.read('number_p'), 10);
        var q = parseInt(input.read('number_q'), 10);
        var text = input.read('text');

        code = coding(p, q, text);

        input.write('code', code);
    });

    $('#decoding').on('click', function () {
        var input = new Input();
        var decode;

        var code = input.readFromHtml('code');
        var d = parseInt(input.read('secret_d'), 10);
        var n = parseInt(input.read('secret_n'), 10);

        decode = decoding(d, n, code);

        input.write('decode', decode);
    });

    var characters = ['#', 'А', 'Б', 'В', 'Г', 'Ґ', 'Д', 'Е', 'Є', 'Ж', 'З', 'И', 'І', 'Ї',
        'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С',
        'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь',
        'Ю', 'Я', ' ', '1', '2', '3', '4', '5', '6', '7',
        '8', '9', '0'];

    function coding(p, q, string) {
        var result;
        var n;
        var m;
        var d;
        var e_;

        if ((p < 0) && (q < 0)) {
            return alert("Enter valid p and q! p and q must be positive numbers");
        }

        if (!isNumberSimple(p) || !isNumberSimple(q)) {
            return alert("p or q - not simple numbers!");
        }

        string = string.toUpperCase();

        n = p * q;
        m = (p - 1) * (q - 1);
        d = calculate_d(m);
        e_ = calculate_e(d, m);

        result = rsaEndoce(string, e_, n);

        return result.join(',');
    }

    function decoding(d, n, code) {
        if (!code) {
            return alert('Something must be code! ');
        }

        if ((d < 0) && (n < 0)) {
            return alert("Enter valid secret key! d and n must be positive numbers");
        }

        return rsaDedoce(code, d, n);
    }

    function isNumberSimple(number) {
        if (number < 2)
            return false;

        if (number === 2)
            return true;

        for (var i = 2; i < number; i++) {
            if (number % i === 0) {
                return false;
            }
        }

        return true;
    }

    function rsaEndoce(s, e, n) {
        var result = [];
        var bi;

        for (var i = 0; i < s.length; i++) {
            bi = characters.indexOf(s[i]);

            bi = fastmodexp(bi, e, n);

            result.push(bi.toString());
        }

        return result;
    }

    function rsaDedoce(input, d, n) {
        var result = "";
        var bi;
        var data = input.split(',');

        for (var i = 0, len = data.length; i < len; i++) {

            bi = parseFloat(data[i]);

            bi = fastmodexp(bi, d, n);

            bi = parseInt(bi);

            result += characters[bi].toString();
        }
        return result;
    }

    function calculate_d(m) {
        var d = m - 1;

        for (var i = 2; i <= m; i++) {
            if ((m % i === 0) && (d % i === 0)) {
                d--;
                i = 1;
            }
        }

        return d;
    }

    function calculate_e(d, m) {
        var e = 10;

        while (true) {
            if ((e * d) % m === 1){
                break;
            }

            e++;
        }

        return e;
    }

    function numtobin(num) {
        var bintext = "";
        var bits = Math.floor(Math.log(num) / Math.log(2)) + 1;
        var currentnum = num;

        for (var i = 0; i < bits; i++) {
            bintext = currentnum % 2 + bintext;
            currentnum = Math.floor(currentnum / 2);
        }
        return bintext;
    }

    function bintonum(binchars) {
        var binnum = 0;
        var multiplier = 1;

        for (var i = 0; i < binchars.length; i++) {
            if (binchars[binchars.length - i - 1] === "1") {
                binnum += multiplier;
            }
            multiplier *= 2;
        }
        return binnum;
    }

    function mymod(A, B) {
        return A - Math.floor(A / B) * B;
    }

    function fastmodexp(A, B, C) {

        var binB = numtobin(B);
        var Bdigits = binB.length;

        var AtoBmodC = [];

        var power = 1;
        var product = 0;

        for (var i = 0; i < Bdigits; i++) {
            if (!i) {
                AtoBmodC[0] = mymod(A, C);
            }
            else {
                AtoBmodC[i] = mymod(AtoBmodC[i - 1] * AtoBmodC[i - 1], C);
            }


            if (binB.charAt(Bdigits - 1 - i) === "1") {

                if (product === 0) {
                    product = AtoBmodC[i];
                } else {
                    product *= AtoBmodC[i];
                }

                product = mymod(product, C);
            }


            power *= 2;
        }

        return mymod(product, C);
    }

});
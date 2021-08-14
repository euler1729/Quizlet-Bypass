// Remove 'x' free solutions badge and "verify your email" badge.
if (document.querySelector('.BannerWrapper')) { document.querySelector('.BannerWrapper').style.display = "none"; }
if (document.querySelector('.UINotification')) { document.querySelector('.UINotification').style.display = "none"; }

checkIfNewAccountNeeded();

function checkIfNewAccountNeeded()
{
    // Three cases: Almost out of solutions, not logged in at all, or out of solutions.

    // Almost out of solutions
    if (pageContains("This is your last free explanation"))
    {
        // Don't reload, not actually out of solutions yet.
        signUpNewAccount(false);
    }
    // Not logged in
    else if (pageContains("Create a free account to see explanations"))
    {
        signUpNewAccount(true);
    }
    // Out of solutions
    else if (pageContains("YOU'VE REACHED YOUR FREE LIMIT"))
    {
        signUpNewAccount(true);
    }


    // Catchall for logged out entirely.
    else if (!isLoggedIn())
    {
        signUpNewAccount(true);
    }
    // Catchall for out of solutions
    else if (pageContains('source=explanations_meter_exceeded'))
    {
        signUpNewAccount(true);
    }
}

function signUpNewAccount(doesReload)
{
    // We're just gonna assume this is a large enough characterspace for it to never matter.
    var name = "sq_bypass_" + randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    var request = fetch("https://quizlet.com/webapi/3.2/direct-signup", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "cs-token": getToken(),
            "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://quizlet.com/goodbye",
        "referrerPolicy": "origin-when-cross-origin",
        "body": "{\"TOS\":false,\"birth_day\":\"5\",\"birth_month\":\"5\",\"birth_year\":\"2000\",\"email\":\"" + name + "@example.com\",\"is_free_teacher\":\"2\",\"is_parent\":false,\"password1\":\"SladerBypassPassword\",\"redir\":\"https://quizlet.com/goodbye\",\"signupOrigin\":\"global-header-link\",\"screenName\":\"Logout/logoutMobileSplash\",\"username\":\"" + name + "\",\"marketing_opt_out\":false}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(function()
    {
        if (doesReload)
        {
            location.reload();
        }
    });
    return true;
};

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

function getToken(){
    token = document.cookie.match("(?:^|;)\\s*" + "qtkn".replace(/[\-\[\]{}()*+?.,\\^$|#\s]/g, "$&") + "=([^;]*)");
    return decodeURIComponent(token[1]);
};

function pageContains(str)
{
    if (document.body.innerHTML.match(str))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isLoggedIn()
{
    // Looks for `{"LOGGED_IN":false,` in the header.
    var li = document.head.innerHTML.match(/(?<="LOGGED_IN":)\w[^,]*/)[0];

    if (li === "false")
    {
        return false;
    }
    else if (li === "true")
    {
        return true;
    }
    else
    {
        return true; // Return true on possible error to prevent explosion of accounts. Effectively assumes logged in on error.
    }
}
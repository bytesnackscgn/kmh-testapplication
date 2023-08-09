import { boot } from 'quasar/wrappers'

type Compareable = string | boolean | number;
type PasswordRules = {
	nePwd: boolean;
	pwdReqSpecialChar: boolean;
	pwdReqNumber: boolean;
	pwdReqAlpha: boolean;
	pwdReqMin: boolean;
};

export default boot(({ app }) =>  {
    const isNumeric = (str: string  ) => {
        if (typeof str != 'string') return false; // we only process strings!
        return !isNaN(Number.parseFloat(str as string));
    }
    const phoneNumber = (phoneNumber: string) => {
        if(`${phoneNumber}`.trim().length == 0){
            return true;
        }
        if (`${phoneNumber}`.length > 18) {
            return false;
        }
        const regEx = /^\+{0,2}([\-\. ])?()?([\-\. ])??([\-\. ])?\d{3}([\-\. ])?\d{4}/;
        if (`${phoneNumber}`.match(regEx)) {
            return true;
        } else {
            return false;
        }
    }
    const email = (email: string) => {
        if(`${email}`.trim().length == 0) return true;
        return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : false;
    }
    const equal = (val: Compareable, val_: Compareable) : boolean => {
        return val === val_;
    }
    const isString = (val: unknown) => {
        return typeof val === 'string' || val instanceof String;
    }
    const containSpeacialChar = (val: string) => {
        if(typeof val === 'undefined' || val === null) return false;
        return val.match(/\W|_/g) ? true : false;
    }
    const containsNumber = (val: string) => {
        if(typeof val === 'undefined' || val === null) return false;
        return val.match(/\d/) ? true : false;
    }
    const containsLowLetter = (val: string) => {
        if(typeof val === 'undefined' || val === null) return false;
        return val.match(/[a-z]/) ? true : false;
    }
    const containsCapitalLetter = (val: string ) => {
        if(typeof val === 'undefined' || val === null) return false;
        return val.match(/[A-Z]/) ? true : false;
    }
    const containsCapitalLowLetter = (val: string ) => {
        return containsLowLetter(val) && containsCapitalLetter(val);
    }
    const minLength = (val: string ,length: number ) => {
        return typeof val != 'undefined' && val != null ? val.length >= length : false;
    }
    const validatePassword = (val: string, val_: string) : PasswordRules=> {
        return {
            nePwd : equal(val,val_),
            pwdReqSpecialChar : containSpeacialChar(val),
            pwdReqNumber : containsNumber(val),
            pwdReqAlpha : containsCapitalLowLetter(val),
            pwdReqMin : minLength(val,8)
        };
    }
    const validatePasswordInvalidKey = (val: string, val_: string): keyof PasswordRules | (keyof PasswordRules)[] | boolean => {
		const rules: PasswordRules = validatePassword(val, val_);
		const invalidKeys: (keyof PasswordRules)[] = [];
	  
		Object.entries(rules).forEach(([key, value]) => {
		  if (value === false) {
			invalidKeys.push(key as keyof PasswordRules);
		  }
		});
	  
		if (invalidKeys.length === 1) {
		  return invalidKeys[0];
		} else if (invalidKeys.length > 1) {
		  return invalidKeys;
		}
	  
		return true;
	};
	  
    const validatePasswordState = (val: string, val_: string) => {
        const rules: PasswordRules = validatePassword(val, val_);
		const invalidKeys: (keyof PasswordRules)[] = [];
	  
		Object.entries(rules).forEach(([key, value]) => {
		  if (value === false) {
			invalidKeys.push(key as keyof PasswordRules);
		  }
		});
	  
		if (invalidKeys.length > 0) {
			return false;
		}
	  
		return true;
    }
    app.config.globalProperties.$validator = {
        isNumeric,
        phoneNumber,
        email,
        equal,
        isString,
        containSpeacialChar,
        containsNumber,
        containsLowLetter,
        containsCapitalLetter,
        containsCapitalLowLetter,
        minLength,
        validatePasswordInvalidKey,
        validatePassword,
        validatePasswordState
    }
});

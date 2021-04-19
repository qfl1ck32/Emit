export default class PasswordStrengthChecker {
    private static instance: PasswordStrengthChecker

    private progressToColorAndMessage: object

    private oneLowerCase: RegExp
    private oneUpperCase: RegExp
    private oneNumber: RegExp
    private oneSpecialCharacter: RegExp
    private atLeast8Characters: RegExp

    public static getInstance(): PasswordStrengthChecker {
        if (!PasswordStrengthChecker.instance)
            PasswordStrengthChecker.instance = new PasswordStrengthChecker()

        return PasswordStrengthChecker.instance;
    }


    private constructor() {
        this.progressToColorAndMessage = {}

        this.oneLowerCase = new RegExp('^(?=.*[a-z])')
        this.oneUpperCase = new RegExp('^(?=.*[A-Z])')
        this.oneNumber = new RegExp('^(?=.*[0-9])')
        this.oneSpecialCharacter = new RegExp('(?=.*[!@#$%^&*,.()])')
        this.atLeast8Characters = new RegExp('(?=.{8,})')

        this.progressToColorAndMessage = {
            0: {
                color: 'lightgreen',
                message: ''
            },

            20: {
                color: 'red',
                message: 'Weak'
            },
            
            40: {
                color: 'orange',
                message: 'Medium'
            },

            60: {
                color: 'orange',
                message: 'Medium'
            },

            80: {
                color: 'green',
                message: 'Pretty good'
            },

            100: {
                color: 'green',
                message: 'Strong'
            }
        }
    }

    private checkAll = (text: string): number => {
        return [this.oneLowerCase,
                this.oneUpperCase,
                this.oneNumber,
                this.oneSpecialCharacter,
                this.atLeast8Characters].reduce((acc: number, curr: RegExp) => {
                    return acc + 0.2 * (curr.test(text) ? 1 : 0)
                }, 0)
    }

    public getStrength(password: string): object {
        const progress = this.checkAll(password)

        for (let index in this.progressToColorAndMessage) {
            const currentProgress: number = parseInt(index) / 100

            if (currentProgress >= progress)
                return {
                    ...this.progressToColorAndMessage[index],
                    progress: currentProgress
                }
        }

        return {}
    }
}
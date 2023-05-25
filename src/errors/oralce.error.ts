export const errorType = ({ error, userId, role, privilege, table }: any) => {
    let message = 'Error when execute'

    switch (error.errorNum) {
        case 900:
            message = `Invalid SQL statement`
            break
        case 942:
            message = `Table or view does not exist`
            break
        case 990:
            message = `Missing or invalid privilege`
            break
        case 1017:
            message = `Invalid username/password, logon denied`
            break
        case 1031:
            message = `Insufficient privileges`
            break
        case 1036:
            message = `Illegal variable name or number`
            break
        case 1917:
            message = `User or role does not exist`
            break
        case 1918:
            message = `User does not exist`
            break
        case 1919:
            message = `Role does not exist`
            break
        case 1920:
            message = `User name conflicts with another user or role name`
            break
        case 1921:
            message = `Role name conflicts with another user or role name`
            break
        case 1927:
            message = 'Cannot REVOKE privileges you did not grant'
            break
        case 1951:
            message = 'Cannot REVOKE role you did not grant'
            break
        case 65096:
            message = `Invalid common user or role name`
            break
    }

    console.log("🚀 ~ file: oralce.error.ts:2 ~ errorType ~ error:", error)

    return {
        status: 'failed',
        message
    }
}
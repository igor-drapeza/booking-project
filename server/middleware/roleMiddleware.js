module.exports = function (requiredRole) {
    return function (req, res, next) {
        try {
            if (req.method === "OPTIONS") {
                next()
            }
            if (!req.user) {
                return res.status(401).json({
                    message: "Пользователь не авторизован"
                })
            }

            if (req.user.role !== requiredRole) {
                return res.status(403).json({
                    message: "Нет доступа"
                })
            }
            next()

        } catch (error) {
            return res.status(403).json({
                message: "Нет доступа"
            })
        }
    }
}
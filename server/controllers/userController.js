const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Role } = require('../models/User')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    )
}

class UserController {
    async registration(req, res) {
        try {
            const {
                email,
                name,
                password,
                phone,
                avatar_url = "empty",
                roleId = "d7dfebf9-d02d-42fa-8e9e-f7bf433beb47"
            } = req.body

            if (!email || !password || !phone) {
                return res.status(400).json({
                    message: "Не все обязательные поля заполнены"
                })
            }
            const candidate = await User.findOne({
                where: { email }
            })

            if (candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким email уже существует"
                })
            }

            if (password.length < 6) {
                return res.status(400).json({
                    message: "Пароль должен быть минимум 6 символов"
                })
            }

            const role = await Role.findOne({
                where: { id: roleId }
            })

            if (!role) {
                return res.status(404).json({
                    message: "Роль не найдена"
                })
            }

            const hashPassword = await bcrypt.hash(password, 5)

            const user = await User.create({
                email,
                name,
                password_hash: hashPassword,
                phone,
                avatar_url,
                role_id: roleId
            })

            const token = generateJwt(
                user.id,
                user.email,
                role.name
            )

            return res.status(201).json({
                token,
                user
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при регистрации",
                error: error.message
            })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body

            const user = await User.findOne({
                where: { email },
                include: Role
            })

            if (!user) {
                return res.status(404).json({
                    message: "Пользователь не найден"
                })
            }

            const comparePassword = bcrypt.compareSync(
                password,
                user.password_hash
            )

            if (!comparePassword) {
                return res.status(400).json({
                    message: "Неверный пароль"
                })
            }

            const token = generateJwt(
                user.id,
                user.email,
                user.role.name
            )

            return res.json({
                token,
                user
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при авторизации",
                error: error.message
            })
        }
    }

    async getAll(req, res) {
        try {
            const users = await User.findAll({
                attributes: {
                    exclude: ['password_hash']
                },
                include: Role
            })

            return res.json(users)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении пользователей",
                error: error.message
            })
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params

            const user = await User.findOne({
                where: { id },
                attributes: {
                    exclude: ['password_hash']
                },
                include: Role
            })

            if (!user) {
                return res.status(404).json({
                    message: "Пользователь не найден"
                })
            }

            return res.json(user)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении пользователя",
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params

            const {
                email,
                phone,
                avatar_url,
                roleId
            } = req.body

            const user = await User.findOne({
                where: { id }
            })

            if (!user) {
                return res.status(404).json({
                    message: "Пользователь не найден"
                })
            }

            if (email) {
                const existingEmail = await User.findOne({
                    where: { email }
                })

                if (existingEmail && existingEmail.id !== user.id) {
                    return res.status(400).json({
                        message: "Email уже используется"
                    })
                }

                user.email = email
            }

            if (roleId) {
                const role = await Role.findOne({
                    where: { id: roleId }
                })

                if (!role) {
                    return res.status(404).json({
                        message: "Роль не найдена"
                    })
                }

                user.roleId = roleId
            }

            user.phone = phone || user.phone
            user.avatar_url = avatar_url || user.avatar_url

            await user.save()

            return res.json(user)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при обновлении пользователя",
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params

            const user = await User.findOne({
                where: { id }
            })

            if (!user) {
                return res.status(404).json({
                    message: "Пользователь не найден"
                })
            }

            await user.destroy()

            return res.json({
                message: "Пользователь успешно удален"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при удалении пользователя",
                error: error.message
            })
        }
    }

    async check(req, res) {
        try {
            const user = await User.findOne({
                where: { id: req.user.id },
                include: Role,
                attributes: {
                    exclude: ['password_hash']
                }
            })

            const token = generateJwt(
                user.id,
                user.email,
                user.role.name
            )

            return res.json({
                token,
                user
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка проверки токена",
                error: error.message
            })
        }
    }
}

module.exports = new UserController()
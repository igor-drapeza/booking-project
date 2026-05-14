const Role = require('../models/Role')

class RoleController {
    async create(req, res) {
        try {
            const { name, description } = req.body

            if (!name || !description) {
                return res.status(400).json({
                    message: "Все поля обязательны!"
                })
            }

            if (name.length < 3) {
                return res.status(400).json({
                    message: "Название роли должно быть больше 3 символов!"
                })
            }

            const existingRole = await Role.findOne({
                where: { name }
            })

            if (existingRole) {
                return res.status(400).json({
                    message: "Роль с таким названием уже существует!"
                })
            }

            const role = await Role.create({
                name,
                description
            })

            return res.status(201).json(role)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при создании роли",
                error: error.message
            })
        }
    }

    async getAll(req, res) {
        try {
            const roles = await Role.findAll()

            return res.json(roles)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении ролей",
                error: error.message
            })
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params

            const role = await Role.findOne({
                where: { id }
            })

            if (!role) {
                return res.status(404).json({
                    message: "Роль не найдена"
                })
            }

            return res.json(role)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении роли",
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const { name, description } = req.body

            const role = await Role.findOne({
                where: { id }
            })

            if (!role) {
                return res.status(404).json({
                    message: "Роль не найдена"
                })
            }

            const existingRole = await Role.findOne({
                where: { name }
            })

            if (existingRole && existingRole.id !== role.id) {
                return res.status(400).json({
                    message: "Роль с таким названием уже существует!"
                })
            }

            if (name && name.length < 3) {
                return res.status(400).json({
                    message: "Название роли должно быть больше 3 символов!"
                })
            }

            role.name = name || role.name
            role.description = description || role.description

            await role.save()

            return res.json(role)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при обновлении роли",
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params

            const role = await Role.findOne({
                where: { id }
            })

            if (!role) {
                return res.status(404).json({
                    message: "Роль не найдена"
                })
            }

            await role.destroy()

            return res.json({
                message: "Роль успешно удалена!"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при удалении роли",
                error: error.message
            })
        }
    }
}

module.exports = new RoleController()
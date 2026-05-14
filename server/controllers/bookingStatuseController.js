const BookingStatuse = require('../models/bookingStatuse')

class BookingStatuseController {

    async create(req, res) {
        try {

            const { name, description } = req.body

            if (!name) {
                return res.status(400).json({
                    message: "Название статуса обязательно"
                })
            }

            if (name.length < 3) {
                return res.status(400).json({
                    message: "Название статуса должно быть минимум 3 символа"
                })
            }

            const existingStatus = await BookingStatuse.findOne({
                where: { name }
            })

            if (existingStatus) {
                return res.status(400).json({
                    message: "Статус уже существует"
                })
            }

            const status = await BookingStatuse.create({
                name,
                description
            })

            return res.status(201).json(status)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при создании статуса",
                error: error.message
            })
        }
    }

    async getAll(req, res) {
        try {

            const statuses = await BookingStatuse.findAll()

            return res.json(statuses)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении статусов",
                error: error.message
            })
        }
    }

    async getOne(req, res) {
        try {

            const { id } = req.params

            const status = await BookingStatuse.findOne({
                where: { id }
            })

            if (!status) {
                return res.status(404).json({
                    message: "Статус не найден"
                })
            }

            return res.json(status)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении статуса",
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params

            const { name, description } = req.body

            const status = await BookingStatuse.findOne({
                where: { id }
            })

            if (!status) {
                return res.status(404).json({
                    message: "Статус не найден"
                })
            }

            if (name && name.length < 3) {
                return res.status(400).json({
                    message: "Название статуса должно быть минимум 3 символа"
                })
            }

            if (name) {

                const existingStatus = await BookingStatuse.findOne({
                    where: { name }
                })

                if (
                    existingStatus &&
                    existingStatus.id !== status.id
                ) {
                    return res.status(400).json({
                        message: "Статус с таким названием уже существует"
                    })
                }

                status.name = name
            }

            if (description !== undefined) {
                status.description = description
            }

            await status.save()

            return res.json(status)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при обновлении статуса",
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {

            const { id } = req.params

            const status = await BookingStatuse.findOne({
                where: { id }
            })

            if (!status) {
                return res.status(404).json({
                    message: "Статус не найден"
                })
            }

            await status.destroy()

            return res.json({
                message: "Статус успешно удален"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при удалении статуса",
                error: error.message
            })
        }
    }
}

module.exports = new BookingStatuseController()
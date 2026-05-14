const { ScheduleSlot, User } = require('../models/scheduleSlot')

class ScheduleSlotController {

    async create(req, res) {
        try {

            const {
                master_id,
                start_time,
                end_time
            } = req.body

            if (
                !master_id ||
                !start_time ||
                !end_time
            ) {
                return res.status(400).json({
                    message: "Не все обязательные поля заполнены"
                })
            }

            const master = await User.findOne({
                where: { id: master_id }
            })

            if (!master) {
                return res.status(404).json({
                    message: "Мастер не найден"
                })
            }

            const startDate = new Date(start_time)
            const endDate = new Date(end_time)

            if (startDate >= endDate) {
                return res.status(400).json({
                    message: "Время окончания должно быть больше времени начала"
                })
            }

            const existingSlot = await ScheduleSlot.findOne({
                where: {
                    master_id,
                    start_time: startDate,
                    end_time: endDate
                }
            })

            if (existingSlot) {
                return res.status(400).json({
                    message: "Слот с таким временем уже существует"
                })
            }

            const slot = await ScheduleSlot.create({
                master_id,
                start_time,
                end_time
            })

            return res.status(201).json(slot)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при создании слота",
                error: error.message
            })
        }
    }

    async getAll(req, res) {
        try {

            const slots = await ScheduleSlot.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'phone']
                    }
                ]
            })

            return res.json(slots)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении слотов",
                error: error.message
            })
        }
    }

    async getOne(req, res) {
        try {

            const { id } = req.params

            const slot = await ScheduleSlot.findOne({
                where: { id },

                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'phone']
                    }
                ]
            })

            if (!slot) {
                return res.status(404).json({
                    message: "Слот не найден"
                })
            }

            return res.json(slot)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении слота",
                error: error.message
            })
        }
    }

    async getMasterSlots(req, res) {
        try {

            const { masterId } = req.params

            const slots = await ScheduleSlot.findAll({
                where: { master_id: masterId },

                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'phone']
                    }
                ]
            })

            return res.json(slots)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении слотов мастера",
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params

            const {
                start_time,
                end_time,
                is_booked
            } = req.body

            const slot = await ScheduleSlot.findOne({
                where: { id }
            })

            if (!slot) {
                return res.status(404).json({
                    message: "Слот не найден"
                })
            }

            if (start_time && end_time) {

                const startDate = new Date(start_time)
                const endDate = new Date(end_time)

                if (startDate >= endDate) {
                    return res.status(400).json({
                        message: "Время окончания должно быть больше времени начала"
                    })
                }

                slot.start_time = start_time
                slot.end_time = end_time
            }

            if (typeof is_booked === 'boolean') {
                slot.is_booked = is_booked
            }

            await slot.save()

            return res.json(slot)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при обновлении слота",
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {

            const { id } = req.params

            const slot = await ScheduleSlot.findOne({
                where: { id }
            })

            if (!slot) {
                return res.status(404).json({
                    message: "Слот не найден"
                })
            }

            await slot.destroy()

            return res.json({
                message: "Слот успешно удален"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при удалении слота",
                error: error.message
            })
        }
    }
}

module.exports = new ScheduleSlotController()
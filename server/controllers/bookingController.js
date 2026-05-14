const { Booking, User, Service, ScheduleSlot, BookingStatuse } = require('../models/booking')

class BookingController {
    async create(req, res) {
        try {
            const {
                user_id,
                master_id,
                service_id,
                slot_id,
                status_id,
                booking_date,
                total_price,
                comment
            } = req.body

            if (
                !user_id ||
                !master_id ||
                !service_id ||
                !slot_id ||
                !status_id ||
                !booking_date ||
                !total_price
            ) {
                return res.status(400).json({
                    message: "Не все обязательные поля заполнены"
                })
            }

            const user = await User.findOne({
                where: { id: user_id }
            })

            if (!user) {
                return res.status(404).json({
                    message: "Пользователь не найден"
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

            const service = await Service.findOne({
                where: { id: service_id }
            })

            if (!service) {
                return res.status(404).json({
                    message: "Услуга не найдена"
                })
            }

            const slot = await ScheduleSlot.findOne({
                where: { id: slot_id }
            })

            if (!slot) {
                return res.status(404).json({
                    message: "Слот не найден"
                })
            }

            if (slot.is_booked) {
                return res.status(400).json({
                    message: "Слот уже забронирован"
                })
            }

            const status = await BookingStatuse.findOne({
                where: { id: status_id }
            })

            if (!status) {
                return res.status(404).json({
                    message: "Статус не найден"
                })
            }

            const booking = await Booking.create({
                user_id,
                master_id,
                service_id,
                slot_id,
                status_id,
                booking_date,
                total_price,
                comment
            })

            slot.is_booked = true

            await slot.save()

            return res.status(201).json(booking)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при создании бронирования",
                error: error.message
            })
        }
    }

    async getAll(req, res) {
        try {

            const bookings = await Booking.findAll({

                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email', 'phone']
                    },
                    {
                        model: User,
                        as: 'master',
                        attributes: ['id', 'email', 'phone']
                    },
                    {
                        model: Service
                    },
                    {
                        model: ScheduleSlot
                    },
                    {
                        model: BookingStatuse,
                        as: 'status'
                    }
                ]
            })

            return res.json(bookings)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении бронирований",
                error: error.message
            })
        }
    }

    async getOne(req, res) {
        try {

            const { id } = req.params

            const booking = await Booking.findOne({
                where: { id },

                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email', 'phone']
                    },
                    {
                        model: User,
                        as: 'master',
                        attributes: ['id', 'email', 'phone']
                    },
                    {
                        model: Service
                    },
                    {
                        model: ScheduleSlot
                    },
                    {
                        model: BookingStatuse,
                        as: 'status'
                    }
                ]
            })

            if (!booking) {
                return res.status(404).json({
                    message: "Бронирование не найдено"
                })
            }

            return res.json(booking)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении бронирования",
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params

            const {
                status_id,
                comment,
                confirmedAt,
                completedAt,
                cancelledAt
            } = req.body

            const booking = await Booking.findOne({
                where: { id }
            })

            if (!booking) {
                return res.status(404).json({
                    message: "Бронирование не найдено"
                })
            }

            if (status_id) {

                const status = await BookingStatuse.findOne({
                    where: { id: status_id }
                })

                if (!status) {
                    return res.status(404).json({
                        message: "Статус не найден"
                    })
                }

                booking.status_id = status_id
            }

            booking.comment = comment || booking.comment

            booking.confirmedAt =
                confirmedAt || booking.confirmedAt

            booking.completedAt =
                completedAt || booking.completedAt

            booking.cancelledAt =
                cancelledAt || booking.cancelledAt

            await booking.save()

            return res.json(booking)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при обновлении бронирования",
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {

            const { id } = req.params

            const booking = await Booking.findOne({
                where: { id }
            })

            if (!booking) {
                return res.status(404).json({
                    message: "Бронирование не найдено"
                })
            }

            const slot = await ScheduleSlot.findOne({
                where: { id: booking.slot_id }
            })

            if (slot) {
                slot.is_booked = false
                await slot.save()
            }

            await booking.destroy()

            return res.json({
                message: "Бронирование успешно удалено"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при удалении бронирования",
                error: error.message
            })
        }
    }
}

module.exports = new BookingController()
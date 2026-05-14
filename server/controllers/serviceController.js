const { Service, User, ServiceCategory } = require('../models/service')

class ServiceController {
    async create(req, res) {
        try {
            const {
                master_id,
                category_id,
                title,
                description,
                price,
                duration_minutes,
                is_active
            } = req.body

            if (
                !master_id ||
                !category_id ||
                !title ||
                !price
            ) {
                return res.status(400).json({
                    message: "Не все обязательные поля заполнены"
                })
            }

            if (title.length < 3) {
                return res.status(400).json({
                    message: "Название услуги должно быть минимум 3 символа"
                })
            }

            if (Number(price) <= 0) {
                return res.status(400).json({
                    message: "Цена должна быть больше 0"
                })
            }

            if (duration_minutes && duration_minutes <= 0) {
                return res.status(400).json({
                    message: "Длительность должна быть больше 0"
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

            const category = await ServiceCategory.findOne({
                where: { id: category_id }
            })

            if (!category) {
                return res.status(404).json({
                    message: "Категория не найдена"
                })
            }

            const service = await Service.create({
                master_id,
                category_id,
                title,
                description,
                price,
                duration_minutes,
                is_active
            })

            return res.status(201).json(service)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при создании услуги",
                error: error.message
            })
        }
    }

    async getAll(req, res) {
        try {

            const services = await Service.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'phone']
                    },
                    {
                        model: ServiceCategory
                    }
                ]
            })

            return res.json(services)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении услуг",
                error: error.message
            })
        }
    }

    async getOne(req, res) {
        try {

            const { id } = req.params

            const service = await Service.findOne({
                where: { id },

                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'phone']
                    },
                    {
                        model: ServiceCategory
                    }
                ]
            })

            if (!service) {
                return res.status(404).json({
                    message: "Услуга не найдена"
                })
            }

            return res.json(service)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении услуги",
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params

            const {
                category_id,
                title,
                description,
                price,
                duration_minutes,
                is_active
            } = req.body

            const service = await Service.findOne({
                where: { id }
            })

            if (!service) {
                return res.status(404).json({
                    message: "Услуга не найдена"
                })
            }

            if (category_id) {

                const category = await ServiceCategory.findOne({
                    where: { id: category_id }
                })

                if (!category) {
                    return res.status(404).json({
                        message: "Категория не найдена"
                    })
                }

                service.category_id = category_id
            }

            if (title && title.length < 3) {
                return res.status(400).json({
                    message: "Название услуги должно быть минимум 3 символа"
                })
            }

            if (price && Number(price) <= 0) {
                return res.status(400).json({
                    message: "Цена должна быть больше 0"
                })
            }

            if (duration_minutes && duration_minutes <= 0) {
                return res.status(400).json({
                    message: "Длительность должна быть больше 0"
                })
            }

            service.title = title || service.title
            service.description = description || service.description
            service.price = price || service.price
            service.duration_minutes =
                duration_minutes || service.duration_minutes

            if (typeof is_active === 'boolean') {
                service.is_active = is_active
            }

            await service.save()

            return res.json(service)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при обновлении услуги",
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {

            const { id } = req.params

            const service = await Service.findOne({
                where: { id }
            })

            if (!service) {
                return res.status(404).json({
                    message: "Услуга не найдена"
                })
            }

            await service.destroy()

            return res.json({
                message: "Услуга успешно удалена"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при удалении услуги",
                error: error.message
            })
        }
    }
}

module.exports = new ServiceController()
const ServiceCategory = require('../models/servicecategory')

class ServiceCategoryController {

    async create(req, res) {
        try {
            const { name } = req.body

            if (!name) {
                return res.status(400).json({
                    message: "Название категории обязательно"
                })
            }

            if (name.length < 2) {
                return res.status(400).json({
                    message: "Название категории должно быть минимум 2 символа"
                })
            }

            const existingCategory = await ServiceCategory.findOne({
                where: { name }
            })

            if (existingCategory) {
                return res.status(400).json({
                    message: "Категория уже существует"
                })
            }

            const category = await ServiceCategory.create({
                name
            })

            return res.status(201).json(category)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при создании категории",
                error: error.message
            })
        }
    }

    async getAll(req, res) {
        try {

            const categories = await ServiceCategory.findAll()

            return res.json(categories)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении категорий",
                error: error.message
            })
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params

            const category = await ServiceCategory.findOne({
                where: { id }
            })

            if (!category) {
                return res.status(404).json({
                    message: "Категория не найдена"
                })
            }

            return res.json(category)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при получении категории",
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const { name } = req.body

            const category = await ServiceCategory.findOne({
                where: { id }
            })

            if (!category) {
                return res.status(404).json({
                    message: "Категория не найдена"
                })
            }

            if (!name) {
                return res.status(400).json({
                    message: "Название категории обязательно"
                })
            }

            if (name.length < 2) {
                return res.status(400).json({
                    message: "Название категории должно быть минимум 2 символа"
                })
            }

            const existingCategory = await ServiceCategory.findOne({
                where: { name }
            })

            if (
                existingCategory &&
                existingCategory.id !== category.id
            ) {
                return res.status(400).json({
                    message: "Категория с таким названием уже существует"
                })
            }

            category.name = name

            await category.save()

            return res.json(category)

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при обновлении категории",
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params

            const category = await ServiceCategory.findOne({
                where: { id }
            })

            if (!category) {
                return res.status(404).json({
                    message: "Категория не найдена"
                })
            }

            await category.destroy()

            return res.json({
                message: "Категория успешно удалена"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Ошибка при удалении категории",
                error: error.message
            })
        }
    }
}

module.exports = new ServiceCategoryController()
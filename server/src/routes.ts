import dayjs from "dayjs"
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance) {

    app.post('/habits', async (request, response) => {

        // VALIDANDO OS DADOS QUE ESTÃO VINDO NA REQUISIÇÃO, COM A BIBLIOTECA ZOD = NPM I ZOD
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            )
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()
        
        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            weeb_day: weekDay,
                        }
                    })
                }
            }
        })


    })


    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = dayjs(date).get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                weekDays: {
                    some: {
                        weeb_day: weekDay,
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        })

        return {
            possibleHabits,
            completedHabits
        }

    })



    // app.get('/hello', async () => {

    //     const habits = await prisma.habit.findMany()
    
    //     return habits
    // })
    

}


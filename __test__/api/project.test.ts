import { NextRequest } from "next/server"
import { connectTestDB, clearTestDB, disconnectTestDB, makeRequest } from "../testUtils"
import Project from "@/models/Project"
import { POST as createProject, GET as listProjects } from "@/app/api/projects/route"
import { DELETE as deleteProject } from "@/app/api/projects/[id]/route"

const url = `${process.env.NEXTAUTH_URL}/api/projects?page=1&limit=10`

beforeAll(async () => {
  await connectTestDB()
})

afterEach(async () => {
  await clearTestDB()
})

afterAll(async () => {
  await disconnectTestDB()
})

describe("Project API handlers", () => {
  let projectId: string

  it("creates a project", async () => {
    const req = makeRequest({
      url,
      body: {
        projectName: "project baru",
        customerName: "rizqy",
        address: "bandung",
        startDate: "2025-11-23",
        endDate: "2025-11-30",
        typeOfWork: "pembangunan",
        volume: 20,
        volumeUnit: "m2",
      },
      method: "POST",
    })
    const res = await createProject(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.projectName).toBe("project baru")
    // expect(data.email).toBe("rizqy.dev@gmail.com")
    projectId = data._id
  })

  it("lists projects", async () => {
    await Project.create({
      projectname: "xxx",
      name: "Mouse",
      projectRole: "technician",
      passwordHash: "xxdfsfs23213",
      phoneNumber: "028324324",
    })

    const req = makeRequest({ url, method: "GET" })

    const res = await listProjects(req)
    const data = await res.json()

    console.log(data.data)
    expect(res.status).toBe(200)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBe(1)
  })

  // it("updates a project", async () => {
  //   const created = await Project.create({
  //     projectname: "xxx",
  //     name: "Mouse",
  //     email: "123@gmail.com",
  //     passwordHash: "Logitech",
  //     projectRole: "technician",
  //     phoneNumber: "028324324",
  //   })

  //   projectId = created._id.toString()

  //   const req = makeRequest({ url, body: { name: "Ujang", email: "234@gmail.com" }, method: "PUT" })
  //   const res = await updateProject(req, { params: { id: projectId } })
  //   const data = await res.json()

  //   expect(res.status).toBe(200)
  //   expect(data.name).toBe("Ujang")
  //   expect(data.email).toBe("234@gmail.com")
  // })

  it("deletes a project", async () => {
    const created = await Project.create({
      projectName: "project baru",
      customerName: "rizqy",
      address: "bandung",
      startDate: "2025-11-23",
      endDate: "2025-11-30",
      typeOfWork: "pembangunan",
      volume: 20,
      volumeUnit: "m2",
    })

    projectId = created._id.toString()

    const req = new NextRequest(`${process.env.NEXTAUTH_URL}/api/projects/${projectId}`, {
      method: "DELETE",
    })
    const res = await deleteProject(req, { params: { id: projectId } })

    expect(res.status).toBe(200)
  })
})

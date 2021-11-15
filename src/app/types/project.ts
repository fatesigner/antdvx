export interface IProject {
  id: string;
  name: string;
  owner: string;
  manager: string;
  startDate: string;
  finishDate: string;
  image: string;
}

export interface IProjectDir {
  id: string;
  name: string;
  children: (IProjectDir | IProject)[];
}

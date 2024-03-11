import simpleGit, { SimpleGit } from 'simple-git';
import path from "path";

export const cloneGitRepository = async(repoURL: string, id:string) =>{
    try{
        const git: SimpleGit = simpleGit();
        await git.clone(repoURL, path.join(__dirname, `outputCloned/${id}`))
        console.log('Repository cloned successfully.');
    }catch(error){
        console.error('Error cloning repository:', error);
    }
}
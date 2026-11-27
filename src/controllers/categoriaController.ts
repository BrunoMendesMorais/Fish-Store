import { Request, Response } from "express";
import { CategoriaService } from "../services/categoriaService";

export class categoriaController{
    private categoriaService: CategoriaService;

    constructor(){
        this.categoriaService = new CategoriaService();
    }

    
}
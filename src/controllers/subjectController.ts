import { Request, Response } from 'express';

export const createSubject = (req: Request, res: Response) => {
  res.status(201).json({
    status: 'success',
    data: {
      subject: { name: 'Subject 4' },
    },
  });
};

export const getAllSubjects = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    results: 3,
    data: {
      subjects: [
        { name: 'Subject 1' },
        { name: 'Subject 2' },
        { name: 'Subject 3' },
      ],
    },
  });
};

export const getSubject = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      subject: { name: `Subject with id ${req.params.id}` },
    },
  });
};

export const updateSubject = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      subject: `Subject updated with id ${req.params.id}`,
    },
  });
};

export const deleteSubject = (req: Request, res: Response) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

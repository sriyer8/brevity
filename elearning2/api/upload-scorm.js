import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle file uploads
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const form = formidable({ multiples: false, uploadDir: './public/scorm', keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Failed to upload file' });
        return;
      }

      // Move uploaded file to public/scorm
      const uploadedFile = files.file;
      const destination = path.join('./public/scorm', uploadedFile.originalFilename);

      fs.rename(uploadedFile.filepath, destination, (err) => {
        if (err) {
          console.error('Error moving file:', err);
          res.status(500).json({ error: 'Failed to save file' });
          return;
        }

        console.log('File uploaded successfully:', uploadedFile.originalFilename);
        res.status(200).json({ message: 'File uploaded successfully', filename: uploadedFile.originalFilename });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;

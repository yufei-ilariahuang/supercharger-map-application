// src/pages/DocumentPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Typography, Paper, Box, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface DocumentPageParams {
    [key: string]: string | undefined;
  }

const DocumentPage: React.FC = () => {
  const { collectionName, documentId } = useParams<DocumentPageParams>();
  const [documentData, setDocumentData] = useState<any>(null);

  useEffect(() => {
    if (collectionName && documentId) { // Ensure both parameters are defined
        const fetchData = async () => {
          try {
            const docRef = doc(db, collectionName, documentId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                console.log("Document data:", docSnapshot.data());
                setDocumentData(docSnapshot.data());
            } else {
                console.log("No such document!");
                setDocumentData(null); // Optionally reset state or handle this case
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            // Optionally set an error state here and display it
        }
            };

    fetchData();
} else {
    console.log("Required parameters are missing");
  }
}, [collectionName, documentId]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
         {documentId?.replace(/_/g, ' ')}
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        {documentData ? (
          <Box>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              <LocationOnIcon color="primary" /> {documentData.location}
            </Typography>
            <Typography variant="body1" component="div">
              <strong>Address:</strong> {documentData.address}
            </Typography>
            <Typography variant="body1" component="div">
              <strong>Postal Code:</strong> {documentData.postal}
            </Typography>
            <Typography variant="body1" component="div">
              <strong>URL:</strong> <Link href={documentData.url} target="_blank" rel="noopener">{documentData.url}</Link>
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2">Loading document...</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DocumentPage;

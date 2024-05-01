import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase-config';

// Define an interface for the document object
interface Document {
  id: string;
  [key: string]: any; // Use an index signature for other dynamic fields
}

const CollectionPage: React.FC = () => {
  // Use useParams with an explicit type definition for params
  const { collectionName } = useParams<{ collectionName: string }>();
  
  // Use useState with an explicit type definition for documents
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) {
      setError('Collection name is undefined.');
      setLoading(false);
      return;
    }
    const fetchDocuments = async () => {
      try {
        const docCollection = collection(db, collectionName);
        const snapshot = await getDocs(docCollection);
        const docs: Document[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data()
        }));
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, [collectionName]);

  if (loading) return <p>Loading documents...</p>;

  return (
    <div>
      <h1>{collectionName?.replace(/_/g, ' ')}</h1>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>{doc.id} - {JSON.stringify(doc)}</li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionPage;

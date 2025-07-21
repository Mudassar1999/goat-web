import React from "react"
import { EditClubName } from "./editClubName"
import { EditPlayerPositions } from "./editPlayerPositions"
import { EditDominant } from "./editDominent"
import { EditCounties } from "./editCountries"
import { EditLeagues } from "./editLeagues"

interface EditProps {
     editTitle: string
     fetchProfile: any
     userProfile: any
     setEditProfessionalInfoPop: any
}

const EditProfessionalInfo = ({ editTitle, fetchProfile, userProfile, setEditProfessionalInfoPop }: EditProps) => {

     return (
          <>
               {(editTitle === "Club" || editTitle === "Club's team") &&
                    <EditClubName
                         userProfile={userProfile}
                         fetchProfile={fetchProfile}
                         editTitle={editTitle}
                         setEditProfessionalInfoPop={setEditProfessionalInfoPop}
                    />
               }

               {(editTitle === "Position") &&
                    <EditPlayerPositions
                         userProfile={userProfile}
                         fetchProfile={fetchProfile}
                         editTitle={editTitle}
                         setEditProfessionalInfoPop={setEditProfessionalInfoPop}
                    />
               }

               {(editTitle === "Dominance") &&
                    <EditDominant
                         userProfile={userProfile}
                         fetchProfile={fetchProfile}
                         editTitle={editTitle}
                         setEditProfessionalInfoPop={setEditProfessionalInfoPop}
                    />
               }

               {(editTitle === "Countries") &&
                    <EditCounties
                         userProfile={userProfile}
                         fetchProfile={fetchProfile}
                         editTitle={editTitle}
                         setEditProfessionalInfoPop={setEditProfessionalInfoPop}
                    />
               }

               {(editTitle === "Leagues") &&
                    <EditLeagues
                         userProfile={userProfile}
                         fetchProfile={fetchProfile}
                         editTitle={editTitle}
                         setEditProfessionalInfoPop={setEditProfessionalInfoPop}
                    />
               }
          </>
     )
}

export default EditProfessionalInfo